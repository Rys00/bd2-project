"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { getAllergens, getCategories } from "@/lib/backend-requests/misc";
import {
  ProductView,
  updateProduct,
  updateStock,
} from "@/lib/backend-requests/products";
import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { ProductDescriptorSchema } from "@/lib/zod/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Allergen, Prisma, ProductCategory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import MultipleSelector from "../ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export default function ProductTableCellViewer({
  item,
}: {
  item: ProductView;
}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const form = useForm<z.infer<typeof ProductDescriptorSchema>>({
    resolver: zodResolver(ProductDescriptorSchema),
    defaultValues: {
      id: item.product_id,
      name: item.name,
      categoryId: `${item.category.category_id}`,
      price: new Prisma.Decimal(item.price).toNumber(),
      cost: new Prisma.Decimal(item.cost).toNumber(),
      margin: item.margin,
      allergens: item.allergens.map((a) => `${a.allergen_id}`),
      active: item.active,
      quantity: item.stock_amount,
    },
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  function resetValues() {
    form.setValue("id", item.product_id);
    form.setValue("name", item.name);
    form.setValue("categoryId", `${item.category.category_id}`);
    form.setValue("price", new Prisma.Decimal(item.price).toNumber());
    form.setValue("cost", new Prisma.Decimal(item.cost).toNumber());
    form.setValue("margin", item.margin);
    form.setValue(
      "allergens",
      item.allergens.map((a) => `${a.allergen_id}`)
    );
    form.setValue("active", item.active);
    form.setValue("quantity", item.stock_amount);
  }

  useEffect(() => {
    resetValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onOpen = async () => {
    resetValues();
    setCategories(await getCategories(dispatch));
    setAllergens(await getAllergens(dispatch));
  };

  async function onSubmit(values: z.infer<typeof ProductDescriptorSchema>) {
    try {
      await updateProduct(
        values.id,
        {
          name: values.name,
          category_id: Number(values.categoryId),
          price: new Prisma.Decimal(values.price),
          cost: new Prisma.Decimal(values.cost),
          margin: values.margin,
          allergens: values.allergens.map((a) => Number(a)),
          active: values.active,
        },
        dispatch
      );
      await updateStock(
        {
          updates: [
            {
              product_id: values.id,
              change: values.quantity,
            },
          ],
        },
        dispatch
      );
      dispatch(
        addSnackbar({ message: "Pomyślnie zapisany zmiany", type: "success" })
      );
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith("PWB_ERROR")) {
        dispatch(addSnackbar({ message, type: "error" }));
        return;
      }
      throw error;
    }
  }

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={(b) => {
        setIsOpen(b);
        if (b) onOpen();
      }}
    >
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className={`text-foreground ${
            item.active ? "" : "opacity-50"
          } w-fit px-0 text-left `}
        >
          {item.name}
        </Button>
      </DrawerTrigger>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <DrawerContent>
            <DrawerHeader className="gap-1">
              <DrawerTitle>{item.name}</DrawerTitle>
              <DrawerDescription>Całkowity stan</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-4 px-4 text-sm">
              {!isMobile && (
                <>
                  <ChartContainer config={chartConfig}>
                    <AreaChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        left: 0,
                        right: 10,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                        hide
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Area
                        dataKey="mobile"
                        type="natural"
                        fill="var(--color-mobile)"
                        fillOpacity={0.6}
                        stroke="var(--color-mobile)"
                        stackId="a"
                      />
                      <Area
                        dataKey="desktop"
                        type="natural"
                        fill="var(--color-desktop)"
                        fillOpacity={0.4}
                        stroke="var(--color-desktop)"
                        stackId="a"
                      />
                    </AreaChart>
                  </ChartContainer>
                  <Separator />
                </>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <Label htmlFor="name">Nazwa</Label>
                    <FormControl>
                      <Input id="name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="active">
                        Czy produkt aktywny?
                      </FormLabel>
                      <div className="inline-flex items-center gap-2">
                        <Switch
                          id="active"
                          aria-label="Toggle switch"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="active" className="text-sm font-medium">
                          {field.value ? "Tak" : "Nie"}
                        </Label>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="quantity">
                        Ilość w magazynie
                      </FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">szt.</span>
                        </div>
                        <FormControl>
                          <Input
                            id="quantity"
                            type="number"
                            min={0}
                            max={10000}
                            step={1}
                            placeholder="0"
                            className="pl-10"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="allergens"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel htmlFor="allergens">Alergeny</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        defaultOptions={allergens.map((a) => ({
                          label: a.name,
                          value: `${a.allergen_id}`,
                        }))}
                        placeholder="Wybierz alergeny..."
                        emptyIndicator={
                          <p className="text-center text-base leading-2 text-gray-600 dark:text-gray-400">
                            Brak innych alergenów.
                          </p>
                        }
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="category">Kategoria</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Wybierz kategorię" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem
                                key={c.category_id}
                                value={`${c.category_id}`}
                              >
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="price">Cena</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">zł</span>
                        </div>
                        <FormControl>
                          <Input
                            id="price"
                            type="number"
                            min={0}
                            max={10000}
                            step={0.01}
                            placeholder="0.00"
                            className="pl-9"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="cost">Koszt produkcji</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">zł</span>
                        </div>
                        <FormControl>
                          <Input
                            id="cost"
                            type="number"
                            min={0}
                            max={10000}
                            step={0.01}
                            placeholder="0.00"
                            className="pl-9"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="margin"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel htmlFor="margin">Marża</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">%</span>
                        </div>
                        <FormControl>
                          <Input
                            id="margin"
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            placeholder="0"
                            className="pl-9"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={() => onSubmit(form.getValues())}>Zapisz</Button>
              <DrawerClose asChild>
                <Button variant="outline">Anuluj</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Form>
    </Drawer>
  );
}
