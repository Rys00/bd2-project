import { hashPassword } from "@/utils/misc";

const getData = async () => [
  {
    name: "Mateusz",
    email: "mateusz@gmail.com",
    passwordHash: {
      create: {
        hash: (await hashPassword("mateusz")).toString("base64"),
      },
    },
  },
];

export const USERS_DATA = getData();
