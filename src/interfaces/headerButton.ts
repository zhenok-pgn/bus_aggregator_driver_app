import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router'

export enum headerButtonType {
  'back',
  'add',
  'edit',
}

export interface IHeaderButton {
  name: string
  to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric
  type: headerButtonType
}
