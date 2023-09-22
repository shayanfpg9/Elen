import { usePathname, useRouter } from "next-intl/client";

export default function useNavigate() {
  const pathname = usePathname();
  const router = useRouter();

  return (to, type) => {
    if (type === "locale") {
      router.replace(pathname, { locale: to });
    } else {
      router.push(to);
    }
  };
}
