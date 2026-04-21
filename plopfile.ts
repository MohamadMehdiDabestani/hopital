import { NodePlopAPI } from "plop";

export default function (plop: NodePlopAPI) {
  plop.setGenerator("feature", {
    description: "Create a new feature module (TypeScript)",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Feature name:",
      },
    ],
    actions: function (data) {
      const basePath = "features/{{kebabCase name}}";

      return [
        {
          type: "add",
          path: `${basePath}/components/index.ts`,
          template: `export {};`,
        },
        {
          type: "add",
          path: `${basePath}/actions/index.ts`,
          template: `export {};`,
        },
        {
          type: "add",
          path: `${basePath}/schemas/{{kebabCase name}}.schema.ts`,
          template: `import { z } from 'zod';

export const {{camelCase name}}Schema = z.object({
  // TODO: define fields
});

export type {{properCase name}}Schema = z.infer<typeof {{camelCase name}}Schema>;
`,
        },
        {
          type: "add",
          path: `${basePath}/hooks/use{{properCase name}}.tsx`,
          template: `export const use{{properCase name}} = () => {

  // TODO: implement hook logic

  return {};
};
`,
        },
        {
          type: "add",
          path: `${basePath}/forms/{{kebabCase name}}.form.ts`,
          template: `import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { {{camelCase name}}Schema } from '../schemas/{{kebabCase name}}.schema';

export const use{{properCase name}}Form = (onSubmit: (values: any) => void) =>
  useFormik({
    initialValues: {},
    validationSchema: toFormikValidationSchema({{camelCase name}}Schema),
    onSubmit,
  });
`,
        },
        {
          type: "add",
          path: `${basePath}/queries/{{kebabCase name}}.queries.ts`,
          template: `import { prisma } from '@/src/core/prisma/client';

export const get{{properCase name}}List = async () => {
  return prisma.{{camelCase name}}.findMany();
};
`,
        },
        {
          type: "add",
          path: `${basePath}/store/use{{properCase name}}.store.tsx`,
          template: `import { create } from "zustand";
type {{properCase name}}={}
export const use{{properCase name}}Store = create<{{properCase name}}>((set) => ({
}));

`,
        },
        {
          type: "add",
          path: `${basePath}/index.ts`,
          template: `export * from './components';
export * from './actions';
export * from './schemas';
export * from './forms';
export * from './queries';
`,
        },
      ];
    },
  });
}
