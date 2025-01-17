import { ArrayBufferStream, joinArrayBuffers } from "@holzchopf/array-buffer-stream"
import { ControlSurfaceEvent } from "./control-surface-event"
import { ControlSurfaceOptions } from "./control-surface-options"
import { ControlSurfaceControl } from "./control-surface-control"

/*

control surface state:

uint32le: version

then events:
uint32le: type
uint32le: size
uint32le: 0
size byte: event data

*/

/**
 * Class representing an FL Studio Control Surface plugin state.
 */
export class ControlSurface {
  /**
   * State version number.
   */
  version: number = 1

  /**
   * Surface options.
   */
  options = new ControlSurfaceOptions()

  /**
   * Controls on this surface.
   */
  controls: ControlSurfaceControl[] = []

  /**
   * Creates the binary data for this surface and returns it.
   */
  getBinary(): ArrayBuffer {
    const buffers: ArrayBuffer[] = []

    let stream: ArrayBufferStream

    // header
    stream = new ArrayBufferStream(new ArrayBuffer(4))
    stream.writeUint32(this.version, true)
    buffers.push(stream.buffer)

    // collect events
    const events: ControlSurfaceEvent[] = []
    events.push(...this.options.getEvents())
    this.controls.forEach((control) => {
      events.push(...control.getEvents())
    })

    // store events
    events.forEach((event) => {
      const bytes = event.getBinary()
      const size = bytes.byteLength
      stream = new ArrayBufferStream(new ArrayBuffer(4 + 4 + 4 + size))
      stream.writeUint32(event.type, true)
      stream.writeBigUint64(BigInt(size), true)
      stream.writeBytes(bytes)
      buffers.push(stream.buffer)
    })

    return joinArrayBuffers(buffers)
  }
  /**
   * Sets this surface's values from binary data.
   * @param buffer Binary data.
   */
  setBinary(buffer: ArrayBuffer) {
    const stream = new ArrayBufferStream(buffer)

    // header
    this.version = stream.readUint32(true)

    const events: ControlSurfaceEvent[] = []

    // read events until end of data
    while (!stream.eof()) {
      const type = stream.readUint32(true)
      const size = Number(stream.readBigUint64(true))
      const bytes = stream.readBytes(size)
      const event = ControlSurfaceEvent.create(type, bytes)
      events.push(event)
    }

    // triage events
    const optionEvents: ControlSurfaceEvent[] = []
    let controlEvents: ControlSurfaceEvent[] = []

    events.forEach((event) => {
      if (event.type < 2100) {
        optionEvents.push(event)
      } else {
        controlEvents.push(event)
        // if an EndControl event occurs, push gathered events and start gathering a new control
        if (event.typeName === 'EndControl') {
          const control = new ControlSurfaceControl()
          control.setEvents(controlEvents)
          this.controls.push(control)
          controlEvents = []
        }
      }
    })

    this.options.setEvents(optionEvents)
  }
}