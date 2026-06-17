ALTER TABLE "users" ALTER COLUMN "phone_number" SET DATA TYPE varchar(11);
--> statement-breakpoint
DROP FUNCTION IF EXISTS public.notify_visits_changes();
CREATE OR REPLACE FUNCTION public.notify_visits_changes()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
  payload json;
  full_name text;
  code_meli text;
BEGIN
  SELECT CONCAT(p."firstName", ' ', p."lastName"), p."codeMeli"
  INTO full_name, code_meli
  FROM people p
  WHERE p.id = NEW."personId";

  payload := json_build_object(
    'op', TG_OP,
    'id', NEW.id,
    'siteId', NEW."siteId",
    'doctorId', NEW."doctorId",
    'personId', NEW."personId",
    'status', NEW.status,
    'receptionTime', NEW."receptionTime",
    'treatTime', NEW."treatTime",
    'fullName', full_name,
    'codeMeli', code_meli,
    'exitRoomAt', NEW."exitRoomAt",
    'reciveMedicineTime', NEW."reciveMedicineTime"
  );

  PERFORM pg_notify('visits_changes', payload::text);
  RETURN NULL;
END;
$BODY$;

ALTER FUNCTION public.notify_visits_changes()
    OWNER TO postgres;
--> statement-breakpoint
DROP TRIGGER IF EXISTS visits_changes_trigger ON public.visits;

CREATE TRIGGER visits_changes_trigger
AFTER INSERT OR UPDATE
ON public.visits
FOR EACH ROW
EXECUTE FUNCTION public.notify_visits_changes();
