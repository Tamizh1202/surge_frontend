import { Suspense } from "react";
import Allmenu from "./_components/Allmenu/Allmenu";
import Ourmenu from "./_components/Ourmenu/Ourmenu";
import Details from "./_components/Details/Details";
import ShopSelector from "./_components/ShopSelector/ShopSelector";

export default function ShopCoffeeBeans() {
  return (
    <>
      <Ourmenu />
      <Suspense fallback={null}>
        <ShopSelector />
      </Suspense>
      <Suspense fallback={null}>
        <Allmenu />
      </Suspense>
      <Suspense fallback={null}>
        <Details />
      </Suspense>
    </>
  );
}