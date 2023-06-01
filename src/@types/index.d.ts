
export type Database = "referential" | "target"

export type ColumnInformation = {
    table_catalog: string
    table_schema: string
    table_name: string
    column_name: string
    ordinal_position: number
    column_default: string | null
    is_nullable: string
    data_type: string
    character_maximum_length: number | null
    character_octect_length: number | null
    numeric_precision: number | null
    numeric_precision_radix: number | null
    numeric_scale: number | null
    datetime_precision: number | null
    interval_type: string | null
    interval_precision: number | null
    character_set_catalog: string | null
    character_set_schema: string | null
    character_set_name: string | null
    collation_catalog: string | null
    collation_schema: string | null
    collation_name: string | null
    domain_catalog: string | null
    domain_schema: string | null
    domain_name: string | null
    udt_catalog: string
    udt_schema: string
    udt_name: string
    scope_catalog: string | null
    scope_schema: string | null
    scope_name: string | null
    maximum_cardinality: number | null
    dtd_identifier: number
    is_self_referencing: string
    is_identity: string
    identity_generation: string | null
    identity_start: string | null
    identity_increment: string | null
    identity_maximum: number | null
    identity_minimum: number | null
    identity_cicle: string
    is_generated: string | null
    is_updatable: string
}