"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ErrorPage = () => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const message = params.get("message") || "Nieznany błąd";

  useEffect(() => {
    dispatch(
      addSnackbar({
        message,
        type: "error",
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center align-middle min-h-[100vh] w-full">
      Przepraszamy, na stronie wystąpił błąd - {message}
      <br />
      <Link href="/dashboard">Powrót na stronę główną</Link>
    </div>
  );
};

export default ErrorPage;
