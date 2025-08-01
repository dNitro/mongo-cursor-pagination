import _ from 'underscore';
import { Schema } from 'mongoose';
import find, { FindParams } from './find';
import search, { SearchParams } from './search';
import aggregate from './aggregate';

// Import AggregateParams type from aggregate module
type AggregateParams = Parameters<typeof aggregate>[1];

interface PaginatePluginOptions {
  name?: string;
  searchFnName?: string;
  aggregateFnName?: string;
}

/**
 * Mongoose plugin
 * @param schema mongoose schema.
 * @param options plugin options
 */
export default function paginatePlugin(schema: Schema, options?: PaginatePluginOptions): void {
  /**
   * paginate function
   * @param params required parameter
   */
  const findFn = function(this: any, params: FindParams): Promise<any> {
    if (!this.collection) {
      throw new Error('collection property not found');
    }
    params = _.extend({}, params);

    return find(this.collection, params);
  };

  /**
   * search function
   * @param searchString String to search on. Required parameter
   * @param params search parameters
   */
  const searchFn = function(this: any, searchString: string, params: SearchParams): Promise<any> {
    if (!this.collection) {
      throw new Error('collection property not found');
    }

    params = _.extend({}, params);

    return search(this.collection, searchString, params);
  };

  /**
   * aggregate function
   * @param params aggregate parameters including aggregation pipeline
   */
  const aggregateFn = function(this: any, params: AggregateParams): Promise<any> {
    if (!this.collection) {
      throw new Error('collection property not found');
    }

    params = _.extend({}, params);

    return aggregate(this.collection, params);
  };

  if (options?.name) {
    schema.statics[options.name] = findFn;
  } else {
    schema.statics.paginate = findFn;
  }

  if (options?.searchFnName) {
    schema.statics[options.searchFnName] = searchFn;
  } else {
    schema.statics.search = searchFn;
  }

  if (options?.aggregateFnName) {
    schema.statics[options.aggregateFnName] = aggregateFn;
  } else {
    schema.statics.aggregate = aggregateFn;
  }
}
