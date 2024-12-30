
import elementResizeDetectorMaker from 'element-resize-detector'

function addListener<T extends object>(component: ListenerParam<T>) {
  const containerElement =
    component.container instanceof HTMLElement ? component.container : component.container?.current // Support for React.createRef

  if (!containerElement) {
    console.error('Resize detector: container element is not available.')
    return
  }

  component._erd = elementResizeDetectorMaker({
    strategy: 'scroll'
  })

  component._erdWidth = containerElement.offsetWidth

  component._erd.listenTo(containerElement, (element: HTMLElement) => {
    const width = element.offsetWidth

    if (component._erdWidth !== width) {
      component.resize(component.props)
      component._erdWidth = width
    }
  })
}

export type ListenerParam<T extends object> = {
  _erd: {
    listenTo: (container: HTMLElement, callback: (element: HTMLElement) => void) => void
    removeAllListeners: (container: HTMLElement) => void
  },
  props: T,
  resize: (props: T) => void,
  _erdWidth: number,
  container: HTMLElement | React.RefObject<HTMLElement>
}

function removeListener<T extends object>(component: ListenerParam<T>) {
  const containerElement =
    component.container instanceof HTMLElement ? component.container : component.container?.current // Support for React.createRef

  if (!containerElement) {
    console.error('Resize detector: container element is not available.')
    return
  }

  component._erd.removeAllListeners(containerElement)
}

export default { addListener, removeListener }
