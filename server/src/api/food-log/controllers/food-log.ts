/**
 * food-log controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::food-log.food-log",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("Login required");

      // FALLBACK: Prevents crash if body is empty in Postman
      const requestBody = (ctx.request.body as any) || {};
      const data = requestBody.data || {};

      data.users_permissions_user = user.id;
      (ctx.request.body as any).data = data;

      return await super.create(ctx);
    },

    async find(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("Login required");

      const existingQuery = (ctx.query || {}) as any;
      ctx.query = {
        ...existingQuery,
        filters: {
          ...(existingQuery.filters || {}),
          users_permissions_user: user.id,
        },
      };

      return await super.find(ctx);
    },

    async findOne(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("Login required");

      const { id } = ctx.params;
      const existingQuery = (ctx.query || {}) as any;

      ctx.query = {
        ...existingQuery,
        filters: {
          ...(existingQuery.filters || {}),
          id,
          users_permissions_user: user.id,
        },
      };

      return await super.findOne(ctx);
    },
  }),
);
