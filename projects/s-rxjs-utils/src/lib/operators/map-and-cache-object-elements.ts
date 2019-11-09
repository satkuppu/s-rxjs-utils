import { OperatorFunction } from "rxjs";
import { mapAndCacheElements } from "./map-and-cache-elements";

type ObjectIteratee<T, O> = <K extends keyof T>(
  item: T[K],
  key: number extends keyof T ? string : K,
) => O;

/**
 * Applies `buildDownstreamItem` to each item in the upstream object and emits an array containing the results. Each downstream item is cached using the key generated by `buildCacheKey` so that the next emission contains references to the matching objects from the previous emission, without running `buildDownstreamItem` again. The cache is only held between successive emissions.
 *
 * This is useful e.g. when using the result in an `*ngFor` expression of an angular template, to prevent angular from rebuilding the inner component and to allow `OnPush` optimizations in the inner component.
 *
 * If multiple items in an upstream object have the same cache key, it will only call `buildDownstreamItem` once.
 *
 * ```ts
 * const mapWithCaching = mapAndCacheObjectElements(
 *   (item, key) => key,
 *   (item, key) => item + 1
 * )
 * ```
 * ```
 * source:         -{ a: 1, b: 2 }---{ a: 1, b: 2, c: 3 }---{ b: 2 }--|
 * mapWithCaching: -[2, 3]-----------[2, 3, 4]--------------[3]--|
 * ```
 */
export const mapAndCacheObjectElements = mapAndCacheElements as <
  UpstreamType,
  DownstreamType = UpstreamType[keyof UpstreamType]
>(
  buildCacheKey: ObjectIteratee<UpstreamType, any>,
  buildDownstreamItem: ObjectIteratee<UpstreamType, DownstreamType>,
) => OperatorFunction<UpstreamType, DownstreamType[]>;
