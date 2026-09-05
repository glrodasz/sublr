# AGENTS.md

Convenciones de **sublr**. La regla general: **archivos pequeños y con una sola responsabilidad**, para que cada pieza se pueda testear por separado y leer de un vistazo.

Stack: Next.js 14 (Pages Router) · TypeScript estricto · Firestore + `firebase-admin` · Auth0 · Zod · styled-jsx · Jest · pnpm 9.

---

## 1. Dónde va cada cosa

### `utils/` — genérico, sin negocio

Utilidades que funcionarían igual en cualquier otro proyecto, al estilo de lodash. **No** importan de `types/`, `helpers/` ni `features/`.

```
utils/request.ts          wrapper de fetch
utils/normalizeTag.ts     normalización de strings
utils/sortByCreatedAt.ts  ordenar por createdAt, nulls al final
```

> Si una utilidad necesita importar un tipo del dominio (`Domain`, `Currency`, `Frequency`…), **no es un util: es un helper**. Esa es la prueba rápida.

### `helpers/` — con contexto del proyecto

Misma idea de "utilidad", pero conoce el negocio de sublr.

```
helpers/aggregations.ts           montos mensuales por dominio
helpers/recurrence.ts             próxima ocurrencia según Frequency
helpers/seedDefaultCategories.ts  categorías por defecto
helpers/tagStyles.ts              color por tag, con presets del dominio
```

### `lib/` y `firebase/` — configuración de terceros

Solo singletons y configuración de SDKs. Nada de lógica propia.

```
lib/auth0.ts         initAuth0
firebase/admin.ts    firebase-admin (solo servidor)
firebase/client.ts   SDK de cliente
```

### `features/<nombre>/` — agrupado por feature

Todo lo que solo sirve a una feature vive junta:

```
features/
  onboarding/   el wizard de configuración inicial + el guard de acceso
  dashboard/    la home: breakdown, pagos recientes, próximos vencimientos
  domains/      DomainView, la vista que comparten incomes/investments/savings
  expenses/     la página de gastos: summary, chart y desglose por categoría
```

Cada una con la misma forma interna: `components/`, `hooks/`, `helpers/`, `data/`.

**La regla para decidir dónde va algo: cuenta los consumidores.**

- **Un solo consumidor** → baja a la feature.
- **Dos o más** → sube a la raíz, aunque hoy "parezca" de una feature.

Ejemplos reales: `Combobox` nació en el wizard y vive en `components/atoms/` porque es genérico; `helpers/aggregations` parece de `domains` pero lo usan también dashboard y expenses, así que se queda compartido.

> Cuidado con los barrels: `helpers/index.ts` reexporta, así que un `grep` por el nombre del archivo **no** encuentra a quien lo importa como `from "../helpers"`. Cuenta consumidores mirando también los barrels, o te llevarás a una feature algo que usan tres.

### Compartido entre features

```
components/atoms|molecules|organisms/   Atomic Design
hooks/                                  hooks reutilizables
schemas/                                esquemas Zod
types/                                  tipos del dominio
constants.ts                            constantes y mapas de presentación
```

---

## 2. Estilos

- **styled-jsx** dentro del componente (`<style jsx>{\`…\`}</style>`). No usamos CSS Modules.
- Siempre **design tokens**, nunca hex a mano: `var(--bg-1)`, `var(--accent)`, `var(--r-md)`. Los tokens están en `styles/globals.css`.
- Tema oscuro ("Fintech-noir"). Los acentos por dominio ya existen: `--domain-income`, `--domain-expense`, `--domain-investment`, `--domain-saving`.

### Trampa de especificidad (importante)

`styles/globals.css` estiliza **todos** los `input` y `select`:

```css
input:not([type="checkbox"]):not([type="radio"]) { … }   /* (0,2,1) */
```

styled-jsx compila `.input` a `.input.jsx-hash`, que es solo `(0,2,0)` — **el global gana**. Para sobrescribir hay que anidar:

```css
.control .input { … }   /* (0,4,0) ✓ */
```

Ese detalle causó un doble borde en el wizard. Ojo también con `select`, que trae su propio chevron por `background-image`: si el componente dibuja su icono, hay que poner `background-image: none`.

---

## 3. Datos

**Lectura** — hook con `onSnapshot`, siempre protegido:

```ts
const { ready } = useFirebaseAuth();
useEffect(() => {
  if (!ready || !user?.sub) return;
  return onSnapshot(q, onNext, onError);
}, [ready, user?.sub]);
```

**Escritura** — siempre `fetch` a una API route. El cliente nunca escribe directo a Firestore, aunque las reglas lo permitan.

**Índices** — una query que combine filtros de igualdad con `orderBy` sobre otro campo **necesita índice compuesto** en `firestore.indexes.json`. Si no está, `onSnapshot` falla y la lista queda vacía en silencio. Para colecciones pequeñas suele salir más barato ordenar en cliente (ver `utils/sortByCreatedAt.ts`). Este error dejó todas las categorías vacías en el wizard.

**Otras reglas**

- Borrado suave: `archived: true` en categorías y métodos de pago, `active: false` en transacciones recurrentes. Nunca `.delete()`.
- `createdAt` con `serverTimestamp()`. Llega **`null`** en el eco local antes de que el servidor lo resuelva: cualquier orden o formato tiene que tolerarlo.
- Los campos opcionales se **omiten**, no se mandan como `null` (Firestore distingue).

---

## 4. API routes

Mismo esqueleto en todas (`pages/api/**`):

```ts
export default auth0.withApiAuthRequired(async (req, res) => {
  const session = await auth0.getSession(req, res);
  if (!session?.user?.sub) return res.status(401).json({ error: "Unauthorized" });
  const userId = session.user.sub;

  if (req.method === "POST") {
    const parsed = SomeInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    // recurso ajeno → 403; duplicado → 409
    return res.status(201).json({ id });
  }

  res.setHeader("Allow", "POST");
  return res.status(405).json({ error: "Method not allowed" });
});
```

- Validación con **Zod** desde `schemas/` en toda frontera de entrada.
- Toda FK que venga del cliente (`categoryId`, `paymentMethodId`) se verifica: existe y es del usuario → si no, **403**.
- Rutas estáticas ganan a las dinámicas: `/api/categories/defaults` no choca con `[id].ts`.

---

## 5. Tests

- **Módulos puros** (`utils/`, `helpers/`, `hooks/`, `components/`, `features/**`): test **colocado** junto al archivo.
- **API routes y pages**: en `__tests__/`, con `jest.mock` de `lib/auth0` y `firebase/admin` (ver `__tests__/api/categories/index.test.ts`).
- **Nunca** un `*.test.tsx` dentro de `pages/`: Next lo compila como ruta y rompe el build. Hay un test que lo vigila (`__tests__/pagesDirectory.test.ts`).
- Separa el hook de datos del componente que lo pinta. Así la lógica se testea sin montar UI — ver `features/onboarding/hooks/useMethodsStep.test.ts`.
- Si un test necesita `firebase/client`, mockéalo: el módulo pide credenciales reales al importarse.

---

## 6. Antes de subir

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test
pnpm build
```

Es exactamente lo que corre CI (`.github/workflows/ci.yml`). **`pnpm build` no es opcional**: es el único que detecta rutas rotas, y `tsc` + `jest` en verde no lo garantizan.

Otras notas:

- `pnpm seed:global` siembra el catálogo de `services`; `pnpm seed:user <userId>` siembra datos de un usuario.
- Husky + lint-staged formatean con Prettier al commitear, así que no pelees con el formato.
