CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_name text NOT NULL,
  account_number text NOT NULL,
  logo_url text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'bank',
  notes text NOT NULL DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payment_methods TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payment methods public read" ON public.payment_methods
  FOR SELECT TO anon, authenticated USING (active = true);

CREATE POLICY "Admin manage payment methods" ON public.payment_methods
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER payment_methods_set_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.payment_methods (bank_name, account_name, account_number, type, order_index) VALUES
  ('Bank BCA', 'Mitra Legal UMKM', '1234567890', 'bank', 1),
  ('Bank Mandiri', 'Mitra Legal UMKM', '9876543210', 'bank', 2),
  ('DANA', 'Mitra Legal UMKM', '082186371356', 'ewallet', 3);