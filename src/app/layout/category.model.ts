import { IconName } from "@fortawesome/free-solid-svg-icons"

export type CategoryName = "All" | "AMAZING_VIEWS" | "OMG" | "TREEHOUSES" | "BEACH" | "FARMS" | "CAMPS"
| "LAKES" | "CONTAINERS" | "CAPMING" | "SKING" | "CAMPERS" | "BED_AND_BREAKFEST" | "ROOMS" | "TOWER" | "CAVES" 

export interface Category{
    icon: IconName,
    displayName: string,
    technicalName: CategoryName,
    activated: boolean
}