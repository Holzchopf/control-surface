This file was auto-generated with `zdoccer.js` 2.0.3

# Index

  - [@holzchopf/flstudio-control-surface](#holzchopf-flstudio-control-surface)
    - [The state format](#the-state-format)
      - [State header](#state-header)
      - [State body](#state-body)
      - [Events](#events)
        - [2000 - Surface Settings](#2000-surface-settings)
        - [2002 - Surface Dimensions](#2002-surface-dimensions)
        - [2003 - unknown](#2003-unknown)
        - [2100 - Start Control](#2100-start-control)
        - [2101 - End Control](#2101-end-control)
        - [2102 - Enable Control](#2102-enable-control)
        - [2103 - Control Name](#2103-control-name)
        - [2104 - Control Dimensions](#2104-control-dimensions)
        - [2105 - ILControl](#2105-ilcontrol)
        - [2106 - ILControl, Colors](#2106-ilcontrol-colors)
        - [2107 - ILControl, Properties](#2107-ilcontrol-properties)
    - [`class ControlSurfaceControl extends ControlSurfaceEventGroup`](#class-controlsurfacecontrol-extends-controlsurfaceeventgroup)
      - [`start?: ControlSurfaceEvent`](#start-controlsurfaceevent)
      - [`end?: ControlSurfaceEvent`](#end-controlsurfaceevent)
      - [`enable?: ControlSurfaceEnableControlEvent[]`](#enable-controlsurfaceenablecontrolevent)
      - [`name?: ControlSurfaceStringEvent`](#name-controlsurfacestringevent)
      - [`dimensions?: ControlSurfaceEvent`](#dimensions-controlsurfaceevent)
      - [`ILControl?: ControlSurfaceStringEvent`](#ilcontrol-controlsurfacestringevent)
      - [`colors?: ControlSurfaceStringEvent`](#colors-controlsurfacestringevent)
      - [`properties?: ControlSurfaceStringEvent`](#properties-controlsurfacestringevent)
    - [`class ControlSurfaceEventGroup`](#class-controlsurfaceeventgroup)
      - [`getEventOfType(type: ControlSurfaceEventTypeId)`](#geteventoftype-type-controlsurfaceeventtypeid)
      - [`getEventOfTypeName(type: ControlSurfaceEventTypeName)`](#geteventoftypename-type-controlsurfaceeventtypename)
      - [`getEventsOfType(type: ControlSurfaceEventTypeId)`](#geteventsoftype-type-controlsurfaceeventtypeid)
      - [`getEventsOfTypeName(type: ControlSurfaceEventTypeName)`](#geteventsoftypename-type-controlsurfaceeventtypename)
      - [`getEvents(): ControlSurfaceEvent[]`](#getevents-controlsurfaceevent)
      - [`setEvents(events: ControlSurfaceEvent[])`](#setevents-events-controlsurfaceevent)
    - [`type ControlSurfaceEventTypeName = keyof typeof ControlSurfaceEventTypeRaw`](#type-controlsurfaceeventtypename-keyof-typeof-controlsurfaceeventtyperaw)
    - [`type ControlSurfaceEventTypeId = typeof ControlSurfaceEventTypeRaw[ControlSurfaceEventTypeName]`](#type-controlsurfaceeventtypeid-typeof-controlsurfaceeventtyperaw-controlsurfaceeventtypename)
    - [`const ControlSurfaceEventType =`](#const-controlsurfaceeventtype)
      - [`name: (id: number): ControlSurfaceEventTypeName | 'unknown' =>`](#name-id-number-controlsurfaceeventtypename-unknown)
      - [`byName: (name: string): ControlSurfaceEventTypeId | undefined =>`](#byname-name-string-controlsurfaceeventtypeid-undefined)
    - [`abstract class ControlSurfaceEvent<T = any>`](#abstract-class-controlsurfaceevent-t-any)
      - [`type: number`](#type-number)
      - [`get typeName()`](#get-typename)
      - [`abstract getBinary(): ArrayBuffer`](#abstract-getbinary-arraybuffer)
      - [`abstract setBinary(buffer: ArrayBuffer): void`](#abstract-setbinary-buffer-arraybuffer-void)
      - [`static create(type: number, value?: string | ArrayBuffer)`](#static-create-type-number-value-string-arraybuffer)
    - [`class ControlSurfaceBinaryEvent extends ControlSurfaceEvent<ArrayBuffer>`](#class-controlsurfacebinaryevent-extends-controlsurfaceevent-arraybuffer)
    - [`class ControlSurfaceStringEvent extends ControlSurfaceEvent<string>`](#class-controlsurfacestringevent-extends-controlsurfaceevent-string)
    - [`class ControlSurfaceEnableControlEvent extends ControlSurfaceBinaryEvent`](#class-controlsurfaceenablecontrolevent-extends-controlsurfacebinaryevent)
      - [`getCurrent(): number`](#getcurrent-number)
      - [`setCurrent(value: number)`](#setcurrent-value-number)
      - [`getDefault(): number`](#getdefault-number)
      - [`setDefault(value: number)`](#setdefault-value-number)
      - [`getIndex(): number`](#getindex-number)
      - [`setIndex(value: number)`](#setindex-value-number)
    - [`class ControlSurface`](#class-controlsurface)
      - [`version: number = 1`](#version-number-1)
      - [`options = new ControlSurfaceOptions()`](#options-new-controlsurfaceoptions)
      - [`controls: ControlSurfaceControl[] = []`](#controls-controlsurfacecontrol)
      - [`getBinary(): ArrayBuffer`](#getbinary-arraybuffer)
      - [`setBinary(buffer: ArrayBuffer)`](#setbinary-buffer-arraybuffer)


---

*original Markdown from src/_preamble.md*

<div id="holzchopf-flstudio-control-surface"></div><!-- alias: holzchopf-flstudio-control-surface -->

# @holzchopf/flstudio-control-surface

Allows to read and write FL Studio Control Surface states. The main goal of this package is to modify Control Surface states, thus all the raw data loaded from a state is preserved and all property getters/setters access the raw data.

<div id="the-state-format"></div><!-- alias: the-state-format -->

## The state format

The state consists of a header, followed by body consisting of a variable number of events. I chose the name event because the official documentation for the `.flp` file format - which used a similar "event" based approach - called those data packages events.

<div id="state-header"></div><!-- alias: state-header -->

### State header

The header typically `4 bytes` long. Probably indicating the format version, it is usually the number `1` stored as `uint32le`

| Offset  | Format    | Description | Typical Value
| ---:    | ---       | ---         | ---
| 0       | uint32le  | version     | `0x01 00 00 00`

<div id="state-body"></div><!-- alias: state-body -->

### State body

The body is of variable length and consists of events. Each event has this structure:

| Offset  | Format    | Description | Typical Value
| ---:    | ---       | ---         | ---
| 0       | uint32le  | type
| 4       | uint64le  | size (byte) of event data
| 12      | -         | event data

<div id="events"></div><!-- alias: events -->

### Events

All events can be grouped into Control Surface options (types 20xx) or controls (types 21xx). Listed here are event types typically found:

<div id="2000-surface-settings"></div><!-- alias: 2000-surface-settings -->

#### 2000 - Surface Settings

This event is typically `64 bytes` long and contains Control Surface settings:

| Offset  | Format    | Description | Typical Value
| ---:    | ---       | ---         | ---
| 0       | uint32le  | skip (skip # numbers for the next control's name)
| 4       | uint32le  | flags <br>Bit 0: edit<br>Bit 1: hide buttons<br>Bit 2: hide labels
| 8       | uint32le  | grid size

The rest of the data is typically set to `0x00`.

<div id="2002-surface-dimensions"></div><!-- alias: 2002-surface-dimensions -->

#### 2002 - Surface Dimensions

This event is typically `8 bytes` long.

| Offset  | Format    | Description
| ---:    | ---       | ---
| 0       | uint32le  | width
| 4       | uint32le  | height

<div id="2003-unknown"></div><!-- alias: 2003-unknown -->

#### 2003 - unknown

This event is typically `4 bytes` long.

| Offset  | Format    | Description | Typical Value
| ---:    | ---       | ---         | ---
| 0       | uint32le  | unknown     | `0x02 00 00 00`

<div id="2100-start-control"></div><!-- alias: 2100-start-control -->

#### 2100 - Start Control

This event is typically `32 bytes` long.

| Offset  | Format    | Description | Typical Value
| ---:    | ---       | ---         | ---
| 0       | uint32le  | control type

The rest of the data is typically set to `0x00`.

<div id="2101-end-control"></div><!-- alias: 2101-end-control -->

#### 2101 - End Control

This event is typically `0 bytes` long.

<div id="2102-enable-control"></div><!-- alias: 2102-enable-control -->

#### 2102 - Enable Control

This event is typically `12 bytes` long and describes how to expose this control. A Control can have multiple of these events (i.e. X/Y Controllers have two).

| Offset  | Format    | Description | Typical Value
| ---:    | ---       | ---         | ---
| 0       | float32le | current value
| 4       | float32le | default value
| 8       | uint32le  | list index

<div id="2103-control-name"></div><!-- alias: 2103-control-name -->

#### 2103 - Control Name

The value of this event is a `utf-16le` string.

<div id="2104-control-dimensions"></div><!-- alias: 2104-control-dimensions -->

#### 2104 - Control Dimensions

This event is typically `16 bytes` long and describes the position and size of the control.

| Offset  | Format    | Description | Typical Value
| ---:    | ---       | ---         | ---
| 0       | float32le | x center coordinate
| 4       | float32le | y center coordinate
| 8       | float32le | width
| 12      | float32le | height

<div id="2105-ilcontrol"></div><!-- alias: 2105-ilcontrol -->

#### 2105 - ILControl

The value of this event is a `utf-16le` string. It typically contains all the definitons a `.ilcontrol` file contains.

<div id="2106-ilcontrol-colors"></div><!-- alias: 2106-ilcontrol-colors -->

#### 2106 - ILControl, Colors

The value of this event is a `utf-16le` string. It typically contains the color definitions from the ILControl event.

<div id="2107-ilcontrol-properties"></div><!-- alias: 2107-ilcontrol-properties -->

#### 2107 - ILControl, Properties

The value of this event is a `utf-16le` string. It typically contains the property definitions from the ILControl event.


---

*transformed Javadoc from src/control-surface-control.ts*

<div id="class-controlsurfacecontrol-extends-controlsurfaceeventgroup"></div><!-- alias: controlsurfacecontrol -->

## `class ControlSurfaceControl extends ControlSurfaceEventGroup`


Class representing a control on the surface. Extends [ControlSurfaceEventGroup **&#x1f875;**](#class-controlsurfaceeventgroup).


<div id="start-controlsurfaceevent"></div><!-- alias: start -->

### `start?: ControlSurfaceEvent`


Start event.


<div id="end-controlsurfaceevent"></div><!-- alias: end -->

### `end?: ControlSurfaceEvent`


End event.


<div id="enable-controlsurfaceenablecontrolevent"></div><!-- alias: enable -->

### `enable?: ControlSurfaceEnableControlEvent[]`


Enable events.


<div id="name-controlsurfacestringevent"></div><!-- alias: name -->

### `name?: ControlSurfaceStringEvent`


Name event.


<div id="dimensions-controlsurfaceevent"></div><!-- alias: dimensions -->

### `dimensions?: ControlSurfaceEvent`


Dimension event.


<div id="ilcontrol-controlsurfacestringevent"></div><!-- alias: ilcontrol -->

### `ILControl?: ControlSurfaceStringEvent`


ILControl event.


<div id="colors-controlsurfacestringevent"></div><!-- alias: colors -->

### `colors?: ControlSurfaceStringEvent`


Color event.


<div id="properties-controlsurfacestringevent"></div><!-- alias: properties -->

### `properties?: ControlSurfaceStringEvent`


Properties event.




---

*transformed Javadoc from src/control-surface-event-group.ts*

<div id="class-controlsurfaceeventgroup"></div><!-- alias: controlsurfaceeventgroup -->

## `class ControlSurfaceEventGroup`


Class representing a group of [ControlSurfaceEvent **&#x1f875;**](#abstract-class-controlsurfaceevent-t-any)s.


<div id="geteventoftype-type-controlsurfaceeventtypeid"></div><!-- alias: geteventoftype -->

### `getEventOfType(type: ControlSurfaceEventTypeId)`


Returns the first event in this group of given type id.
- *param* `type` &mdash; [ControlSurfaceEventTypeId **&#x1f875;**](#type-controlsurfaceeventtypeid-typeof-controlsurfaceeventtyperaw-controlsurfaceeventtypename)


<div id="geteventoftypename-type-controlsurfaceeventtypename"></div><!-- alias: geteventoftypename -->

### `getEventOfTypeName(type: ControlSurfaceEventTypeName)`


Returns the first event in this group of given type name.
- *param* `type` &mdash; [ControlSurfaceEventTypeName **&#x1f875;**](#type-controlsurfaceeventtypename-keyof-typeof-controlsurfaceeventtyperaw)


<div id="geteventsoftype-type-controlsurfaceeventtypeid"></div><!-- alias: geteventsoftype -->

### `getEventsOfType(type: ControlSurfaceEventTypeId)`


Returns all events in this group of given type id.
- *param* `type` &mdash; [ControlSurfaceEventTypeId **&#x1f875;**](#type-controlsurfaceeventtypeid-typeof-controlsurfaceeventtyperaw-controlsurfaceeventtypename)


<div id="geteventsoftypename-type-controlsurfaceeventtypename"></div><!-- alias: geteventsoftypename -->

### `getEventsOfTypeName(type: ControlSurfaceEventTypeName)`


Returns all events in this group of given type name.
- *param* `type` &mdash; [ControlSurfaceEventTypeName **&#x1f875;**](#type-controlsurfaceeventtypename-keyof-typeof-controlsurfaceeventtyperaw)


<div id="getevents-controlsurfaceevent"></div><!-- alias: getevents -->

### `getEvents(): ControlSurfaceEvent[]`


Returns the [ControlSurfaceEvent **&#x1f875;**](#abstract-class-controlsurfaceevent-t-any)s making up this group.


<div id="setevents-events-controlsurfaceevent"></div><!-- alias: setevents -->

### `setEvents(events: ControlSurfaceEvent[])`


Sets the [ControlSurfaceEvent **&#x1f875;**](#abstract-class-controlsurfaceevent-t-any)s making up this group.




---

*transformed Javadoc from src/control-surface-event-type.ts*

<div id="type-controlsurfaceeventtypename-keyof-typeof-controlsurfaceeventtyperaw"></div><!-- alias: controlsurfaceeventtypename -->

## `type ControlSurfaceEventTypeName = keyof typeof ControlSurfaceEventTypeRaw`


Known event names.


<div id="type-controlsurfaceeventtypeid-typeof-controlsurfaceeventtyperaw-controlsurfaceeventtypename"></div><!-- alias: controlsurfaceeventtypeid -->

## `type ControlSurfaceEventTypeId = typeof ControlSurfaceEventTypeRaw[ControlSurfaceEventTypeName]`


Known event IDs.


<div id="const-controlsurfaceeventtype"></div><!-- alias: controlsurfaceeventtype -->

## `const ControlSurfaceEventType =`


Types of the events in an [ControlSurfaceEventGroup **&#x1f875;**](#class-controlsurfaceeventgroup).


<div id="name-id-number-controlsurfaceeventtypename-unknown"></div><!-- alias: name -->

### `name: (id: number): ControlSurfaceEventTypeName | 'unknown' =>`


Returns the name of a given event ID, or `'unknown'`.
- *param* `id` &mdash; Event ID.


<div id="byname-name-string-controlsurfaceeventtypeid-undefined"></div><!-- alias: byname -->

### `byName: (name: string): ControlSurfaceEventTypeId | undefined =>`


Returns the ID for a given event name, or `undefined`
- *param* `name` &mdash; Event name.




---

*transformed Javadoc from src/control-surface-event.ts*

<div id="abstract-class-controlsurfaceevent-t-any"></div><!-- alias: controlsurfaceevent -->

## `abstract class ControlSurfaceEvent<T = any>`


Class for events.


<div id="type-number"></div><!-- alias: type -->

### `type: number`


Numeric [ControlSurfaceEventType **&#x1f875;**](#const-controlsurfaceeventtype).


<div id="get-typename"></div><!-- alias: get-typename -->

### `get typeName()`


Name of [ControlSurfaceEventType **&#x1f875;**](#const-controlsurfaceeventtype). Readonly.


<div id="abstract-getbinary-arraybuffer"></div><!-- alias: getbinary -->

### `abstract getBinary(): ArrayBuffer`


Creates the binary data for this event and returns it.


<div id="abstract-setbinary-buffer-arraybuffer-void"></div><!-- alias: setbinary -->

### `abstract setBinary(buffer: ArrayBuffer): void`


Sets this event's values from binary data.
- *param* `buffer` &mdash; Binary data.


<div id="static-create-type-number-value-string-arraybuffer"></div><!-- alias: create -->

### `static create(type: number, value?: string | ArrayBuffer)`


Factory function to create a new specific ControlSurfaceEvent.
- *param* `type` &mdash; ControlSurfaceEventType.


<div id="class-controlsurfacebinaryevent-extends-controlsurfaceevent-arraybuffer"></div><!-- alias: controlsurfacebinaryevent -->

## `class ControlSurfaceBinaryEvent extends ControlSurfaceEvent<ArrayBuffer>`


Event with binary value data.


<div id="class-controlsurfacestringevent-extends-controlsurfaceevent-string"></div><!-- alias: controlsurfacestringevent -->

## `class ControlSurfaceStringEvent extends ControlSurfaceEvent<string>`


Event with string value data.


<div id="class-controlsurfaceenablecontrolevent-extends-controlsurfacebinaryevent"></div><!-- alias: controlsurfaceenablecontrolevent -->

## `class ControlSurfaceEnableControlEvent extends ControlSurfaceBinaryEvent`


Describes how a control is exposed. Enabled controls will have at least one of these events.


<div id="getcurrent-number"></div><!-- alias: getcurrent -->

### `getCurrent(): number`


Returns the control's current value. Float, 0 ... 1


<div id="setcurrent-value-number"></div><!-- alias: setcurrent -->

### `setCurrent(value: number)`


Sets the control's current value. Float, 0 ... 1


<div id="getdefault-number"></div><!-- alias: getdefault -->

### `getDefault(): number`


Returns the control's default value. Float, 0 ... 1


<div id="setdefault-value-number"></div><!-- alias: setdefault -->

### `setDefault(value: number)`


Sets the control's default value. Float, 0 ... 1


<div id="getindex-number"></div><!-- alias: getindex -->

### `getIndex(): number`


Returns the control's list index.


<div id="setindex-value-number"></div><!-- alias: setindex -->

### `setIndex(value: number)`


Sets the control's list index.




---

*transformed Javadoc from src/control-surface.ts*

<div id="class-controlsurface"></div><!-- alias: controlsurface -->

## `class ControlSurface`


Class representing an FL Studio Control Surface plugin state.


<div id="version-number-1"></div><!-- alias: version -->

### `version: number = 1`


State version number.


<div id="options-new-controlsurfaceoptions"></div><!-- alias: options -->

### `options = new ControlSurfaceOptions()`


Surface options.


<div id="controls-controlsurfacecontrol"></div><!-- alias: controls -->

### `controls: ControlSurfaceControl[] = []`


Controls on this surface.


<div id="getbinary-arraybuffer"></div><!-- alias: getbinary -->

### `getBinary(): ArrayBuffer`


Creates the binary data for this surface and returns it.


<div id="setbinary-buffer-arraybuffer"></div><!-- alias: setbinary -->

### `setBinary(buffer: ArrayBuffer)`


Sets this surface's values from binary data.
- *param* `buffer` &mdash; Binary data.


