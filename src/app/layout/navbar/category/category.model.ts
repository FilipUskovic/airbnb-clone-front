import { IconName } from "@fortawesome/free-solid-svg-icons"

export type CategoryName = "ALL" | "AMAZING_VIEWS" | "OMG" | "TREEHOUSES" | "BEACH" | "FARMS" | "CAMPS" | "BOAT" | "CHEF" | "ARTIC" | "LUXES"
| "LAKES" | "CONTAINERS" | "CAMPING" | "SKIING" | "CAMPERS" | "BED_AND_BREAKFEST" | "ROOMS" | "TOWER" | "CAVES" | "TINY_HOMES"

export interface Category{
    icon: IconName,
    displayName: string,
    technicalName: CategoryName,
    activated: boolean
}
