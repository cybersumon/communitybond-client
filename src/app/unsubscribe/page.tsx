
import { Suspense } from "react";

import UnsubscribeForm from "./UnsubscribeForm";


export default function UnsubscribePage() {
  return (
    <main className="bg-(--color-background)">
      <Suspense
        fallback={
          <p className="py-20 text-center text-(--color-muted)">
            Loading unsubscribe form...
          </p>
        }
      >
        <UnsubscribeForm />
      </Suspense>
    </main>
  );
}
