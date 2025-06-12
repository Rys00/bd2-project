import { z } from "zod";

export const ProductDescriptorSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(3, { message: "Nazwa nie może być krótsza niż 3 znaki" }),
  categoryId: z
    .string()
    .regex(/^[0-9]+$/, { message: "Id kategorii musi być numeryczne" }),
  cost: z
    .number()
    .min(0.01, { message: "Koszt nie może być mniejszy niż 0.01" }),
  price: z
    .number()
    .min(0.01, { message: "Cena nie może być mniejsza niż 0.01" }),
  margin: z
    .number()
    .int({ message: "Marża musi być całkowitoliczbowa" })
    .min(0, { message: "Marża nie może być mniejsza niż 0" })
    .max(100, { message: "Marża nie może być większa niż 100" }),
  active: z.boolean(),
  allergens: z.array(
    z.string().regex(/^[0-9]+$/, { message: "Id alergenu musi być numeryczne" })
  ),
  quantity: z
    .number()
    .min(0, { message: "Ilość produktu nie może być mniejsza niż 0" }),
});
