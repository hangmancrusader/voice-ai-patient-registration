import { z } from "zod";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];
const optionalString = z
  .string()
  .optional()
  .transform((value) => value?.trim() === "" ? undefined : value);

export const patientSchema = z.object({
  first_name: z.string().min(1).max(50).regex(/^[A-Za-z'-]+$/),
  last_name: z.string().min(1).max(50).regex(/^[A-Za-z'-]+$/),

  date_of_birth: z.string().refine((value) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date <= new Date();
  }, "Date of birth must be valid and not in the future"),

  sex: z.enum(["Male", "Female", "Other", "Decline to Answer"]),

  phone_number: z.string().regex(/^\d{10}$/, "Phone must contain 10 digits"),

 

  address_line_1: z.string().min(1),
  

  city: z.string().min(1).max(100),

  state: z.string().refine(
    (value) => US_STATES.includes(value),
    "Invalid U.S. state abbreviation"
  ),

  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/),

  
  email: z
  .union([z.string().email(), z.literal("")])
  .optional()
  .transform((value) => value === "" ? undefined : value),

address_line_2: optionalString,

insurance_provider: optionalString,

insurance_member_id: optionalString,

emergency_contact_name: optionalString,

emergency_contact_phone: z
  .union([
    z.string().regex(/^\d{10}$/, "Emergency contact phone must contain 10 digits"),
    z.literal("")
  ])
  .optional()
  .transform((value) => value === "" ? undefined : value),
preferred_language: z
  .string()
  .optional()
  .transform((value) => value?.trim() === "" ? "English" : value ?? "English"),
});
export const updatePatientSchema = patientSchema.partial();