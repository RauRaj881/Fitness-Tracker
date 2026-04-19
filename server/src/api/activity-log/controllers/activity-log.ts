import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::activity-log.activity-log",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("Login required");

      const requestBody = (ctx.request.body as any) || {};
      const data = requestBody.data || {};

      // Based on your schema, the back-relation is users_permissions_user
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
          users_permissions_user: user.id, // Scoping to the specific user ID
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
