/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    datetime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    datetime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Auction: { // root type
    createdOn?: NexusGenScalars['DateTime'] | null; // DateTime
    domain?: string | null; // String
    id: string; // String!
    imageUrl?: string | null; // String
    link?: string | null; // String
    price?: number | null; // Float
  }
  Bike: { // root type
    cooling?: string | null; // String
    displacement?: string | null; // String
    dry_weight?: string | null; // String
    engine?: string | null; // String
    front_brakes?: string | null; // String
    fuel_capacity?: string | null; // String
    fuel_consumption?: string | null; // String
    gearbox?: string | null; // String
    id: string; // String!
    imageUrl?: string | null; // String
    make?: string | null; // String
    model?: string | null; // String
    power?: string | null; // String
    rear_brakes?: string | null; // String
    seat_height?: string | null; // String
    top_speed?: string | null; // String
    torque?: string | null; // String
    total_weight?: string | null; // String
    transmission?: string | null; // String
    type?: string | null; // String
    year?: number | null; // Int
  }
  Mutation: {};
  Query: {};
  User: { // root type
    email?: string | null; // String
    emailVerified?: NexusGenScalars['DateTime'] | null; // DateTime
    id: string; // String!
    image?: string | null; // String
    name?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Auction: { // field return type
    bike: NexusGenRootTypes['Bike'] | null; // Bike
    createdOn: NexusGenScalars['DateTime'] | null; // DateTime
    domain: string | null; // String
    id: string; // String!
    imageUrl: string | null; // String
    isFavourite: boolean | null; // Boolean
    link: string | null; // String
    price: number | null; // Float
  }
  Bike: { // field return type
    auctionsCount: number | null; // Int
    auctionsRecent: Array<NexusGenRootTypes['Auction'] | null> | null; // [Auction]
    cooling: string | null; // String
    displacement: string | null; // String
    dry_weight: string | null; // String
    engine: string | null; // String
    front_brakes: string | null; // String
    fuel_capacity: string | null; // String
    fuel_consumption: string | null; // String
    gearbox: string | null; // String
    id: string; // String!
    imageUrl: string | null; // String
    make: string | null; // String
    model: string | null; // String
    power: string | null; // String
    rear_brakes: string | null; // String
    seat_height: string | null; // String
    top_speed: string | null; // String
    torque: string | null; // String
    total_weight: string | null; // String
    transmission: string | null; // String
    type: string | null; // String
    year: number | null; // Int
  }
  Mutation: { // field return type
    addFavourites: NexusGenRootTypes['User'] | null; // User
    removeFavourites: NexusGenRootTypes['User'] | null; // User
  }
  Query: { // field return type
    auctions: Array<NexusGenRootTypes['Auction'] | null> | null; // [Auction]
    bikeDetails: NexusGenRootTypes['Bike'] | null; // Bike
    bikes: Array<NexusGenRootTypes['Bike'] | null> | null; // [Bike]
    user: NexusGenRootTypes['User'] | null; // User
  }
  User: { // field return type
    email: string | null; // String
    emailVerified: NexusGenScalars['DateTime'] | null; // DateTime
    favourites: Array<NexusGenRootTypes['Auction'] | null> | null; // [Auction]
    favouritesCount: number | null; // Int
    id: string; // String!
    image: string | null; // String
    name: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  Auction: { // field return type name
    bike: 'Bike'
    createdOn: 'DateTime'
    domain: 'String'
    id: 'String'
    imageUrl: 'String'
    isFavourite: 'Boolean'
    link: 'String'
    price: 'Float'
  }
  Bike: { // field return type name
    auctionsCount: 'Int'
    auctionsRecent: 'Auction'
    cooling: 'String'
    displacement: 'String'
    dry_weight: 'String'
    engine: 'String'
    front_brakes: 'String'
    fuel_capacity: 'String'
    fuel_consumption: 'String'
    gearbox: 'String'
    id: 'String'
    imageUrl: 'String'
    make: 'String'
    model: 'String'
    power: 'String'
    rear_brakes: 'String'
    seat_height: 'String'
    top_speed: 'String'
    torque: 'String'
    total_weight: 'String'
    transmission: 'String'
    type: 'String'
    year: 'Int'
  }
  Mutation: { // field return type name
    addFavourites: 'User'
    removeFavourites: 'User'
  }
  Query: { // field return type name
    auctions: 'Auction'
    bikeDetails: 'Bike'
    bikes: 'Bike'
    user: 'User'
  }
  User: { // field return type name
    email: 'String'
    emailVerified: 'DateTime'
    favourites: 'Auction'
    favouritesCount: 'Int'
    id: 'String'
    image: 'String'
    name: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addFavourites: { // args
      id: string; // String!
    }
    removeFavourites: { // args
      id: string; // String!
    }
  }
  Query: {
    auctions: { // args
      bikeId: string; // String!
    }
    bikeDetails: { // args
      id: string; // String!
    }
    bikes: { // args
      search?: string | null; // String
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}