/**
 * Unit schema type
 *
 * At present, mainly exists for translation / compatibility with NRP unit structure
 *
 * @package: HoloREA
 * @author:  pospi <pospi@spadgos.com>
 * @since:   2019-01-19
 */

import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID
} from 'graphql'

const fieldDef = {
  name: 'Unit',
  description: 'A measurement unit for quantifying resources',
  fields: ({
    id: { type: GraphQLID },
    // :TODO: i18n
    name: { type: GraphQLString },
    symbol: { type: GraphQLString }
  })
}

export const Unit = new GraphQLObjectType(fieldDef)
export const UnitInput = new GraphQLInputObjectType({
  ...fieldDef,
  name: 'InputUnit'
})

// temporary interface, should come from zome API types in a final implementation
export interface IUnit {
  id: string,
  name: string,
  symbol: string
}

interface UnitIdx {
  [id: string]: IUnit
}

// temporary lookup table for unit IDs & data
export const allowableUnits: UnitIdx = {
  '': {
    id: 'each',
    name: 'each',
    symbol: ''
  },
  hours: {
    id: 'hours',
    name: 'hours',
    symbol: 'hrs'
  },
  mL: {
    id: 'millilitres',
    name: 'millilitres',
    symbol: 'mL'
  },
  kg: {
    id: 'kilograms',
    name: 'kilograms',
    symbol: 'kg'
  }
}

// temporary method to translate GFD string values into NRP-compatible unit objects
export function inflateUnit (GFDunit: string): IUnit {
  if (!allowableUnits[GFDunit]) {
    throw new Error(`Unit ${GFDunit} not implemented!`)
  }
  return allowableUnits[GFDunit]
}
