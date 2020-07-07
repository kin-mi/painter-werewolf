import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import Konva from 'konva'
import { firestore } from 'firebase'
import { DrawStatus, CollectionName } from '~/utils/constant'

type InjectTypeCanvas = {
  drawStatus: DrawStatus
  loadedTurn: number
  mount(container: HTMLDivElement, color: string): void
  postLine(roomId: string, playId: string): Promise<void>
  loadLine(data: firestore.DocumentData): Promise<void>
}

declare module '@nuxt/types' {
  interface Context {
    $canvas: InjectTypeCanvas
  }
  interface NuxtAppOptions {
    $canvas: InjectTypeCanvas
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $canvas: InjectTypeCanvas
  }
}

/**
 * scrollControl スクロール制御関数
 * @param {Event} event
 */
const scrollControl = (event: Event) => {
  if (event.cancelable) {
    event.preventDefault()
  }
}
/**
 * removeScrollEvent スクロールイベントの抑止
 */
const removeScrollEvent = () => {
  // PCでのスクロール禁止
  document.addEventListener('mousewheel', scrollControl, { passive: false })
  // スマホでのタッチ操作でのスクロール禁止
  document.addEventListener('touchmove', scrollControl, { passive: false })
}
/**
 * undoScrollEvent スクロールイベントを元に戻す
 */
const undoScrollEvent = () => {
  // PCでのスクロール禁止解除
  document.removeEventListener('mousewheel', scrollControl)
  // スマホでのタッチ操作でのスクロール禁止解除
  document.removeEventListener('touchmove', scrollControl)
}

const lineConfig: Konva.LineConfig = {
  stroke: 'black',
  strokeWidth: 5,
  lineCap: 'round',
  globalCompositeOperation: 'source-over', // 消しゴム：'destination-out'
  points: [],
  id: 'free-draw-line',
}

let _stage: Konva.Stage | undefined
let _layer: Konva.Layer | undefined
let _bgImage: Konva.Image | undefined
let _lastLine: Konva.Line | undefined
let _isDrawing: boolean = false

type State = {
  drawStatus: DrawStatus
  loadedTurn: number
}

class Layer extends Konva.Layer {}
/**********************************************
 * ゲーム用Canvasプラグイン
 * @param {Context} ctx
 * @param {(key: string, value: any) => void} inject
 */
const CanvasPlugin: Plugin = (ctx, inject) => {
  /**
   * Observable properties
   */
  const state = Vue.observable({
    drawStatus: 'stop',
    loadedTurn: 0,
  } as State)

  /******************************
   * ゲーム用Canvasをマウントする
   * @param {HTMLDivElement} container
   * @param {string} color
   */
  function mount(container: HTMLDivElement, color: string): void {
    _stage = new Konva.Stage({
      id: 'stage',
      container,
      width: container.clientWidth,
      height: container.clientHeight,
      scale: { x: 1, y: 1 },
    })
    _layer = new Layer()
    _stage.add(_layer)
    _bgImage = new Konva.Image({
      width: container.clientWidth,
      height: container.clientHeight,
      fill: 'white',
      image: undefined,
    })
    _layer.add(_bgImage)
    _stage.draw()
    _stage.on('mousedown touchstart', _mousedown)
    _stage.on('mouseup touchend', _mouseup)
    _stage.on('mousemove touchmove', _mousemove)

    lineConfig.stroke = color
  }

  function _mousedown() {
    if (!_stage || !_layer || _isDrawing || state.drawStatus !== 'start') return
    removeScrollEvent()
    _isDrawing = true
    // 新規ラインの追加
    const pos = _stage.getPointerPosition()
    const scale = _stage.getAbsoluteScale()
    lineConfig.points.concat([pos!.x / scale.x, pos!.y / scale.y])
    _lastLine = new Konva.Line(lineConfig)
    _layer.add(_lastLine)
    _layer.batchDraw()
  }

  function _mouseup() {
    if (!_isDrawing || !_lastLine) return
    undoScrollEvent()
    _isDrawing = false
    state.drawStatus = 'finish'
  }

  function _mousemove() {
    if (!_stage || !_layer || !_isDrawing || !_lastLine) return
    const pos = _stage.getPointerPosition()
    const scale = _stage.getAbsoluteScale()
    const newPoints = _lastLine
      .points()
      .concat([pos!.x / scale.x, pos!.y / scale.y])
    _lastLine.points(newPoints)
    _layer.batchDraw()
  }

  /******************************
   * 描画したlineをFirestoreへ登録する
   * @param {string} roomId
   * @param {string} playId
   */
  async function postLine(roomId: string, playId: string): Promise<void> {
    if (!_lastLine) return
    const playDocRef = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .doc(roomId)
      .collection('playground' as CollectionName)
      .doc(playId)
    const playDoc = await playDocRef.get()
    if (!playDoc.exists) return

    // line payload
    const user = ctx.app.$accessor.auth.user
    const line = {
      id: user.id,
      player: user.playerName,
      line: _lastLine.toJSON(),
      createAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
    }
    await playDocRef.collection('lines' as CollectionName).add(line)
  }

  /******************************
   * lineをキャンバスへ描画する
   * @param {string} docId
   * @param {firestore.DocumentData} data
   */
  async function loadLine(data: firestore.DocumentData): Promise<void> {
    if (!_layer) return
    const jsonStringify = data.line
    const reciveLine = JSON.parse(jsonStringify).attrs as Konva.LineConfig
    const startPoint = [reciveLine.points.shift()!, reciveLine.points.shift()!]
    const stackPoint = reciveLine.points
    const line = new Konva.Line({
      ...reciveLine,
      points: startPoint,
    })
    _layer.add(line)

    const drawPoints = (): Promise<void> | undefined => {
      const newPoints = [stackPoint.shift()!, stackPoint.shift()!]
      if (newPoints[0] === undefined || newPoints[1] === undefined)
        return Promise.resolve()
      line.points(line.points().concat(newPoints))
      _layer!.batchDraw()
      setTimeout(drawPoints, 5)
    }
    await setTimeout(drawPoints, 5)
    state.loadedTurn++
  }

  inject('canvas', {
    get drawStatus() {
      return state.drawStatus
    },
    set drawStatus(value: DrawStatus) {
      state.drawStatus = value
    },
    get loadedTurn() {
      return state.loadedTurn
    },
    mount,
    postLine,
    loadLine,
  })
}

export default CanvasPlugin
