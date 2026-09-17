import { z } from "zod";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

export const patientSchema = z.object({
  first_name: z.string().min(1).max(50).regex(/^[A-Za-z'-]+$/),
  last_name: z.string().min(1).max(50).regex(/^[A-Za-z'-]+$/),

  date_of_birth: z.string().refine((value) => {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date <= new Date();
  }, "Date of birth must be valid and not in the future"),

  sex: z.enum(["Male", "Female", "Other", "Decline to Answer"]),

  phone_number: z.string().regex(/^\d{10}$/, "Phone must contain 10 digits"),

  email: z.string().email().optional(),

  address_line_1: z.string().min(1),
  address_line_2: z.string().optional(),

  city: z.string().min(1).max(100),

  state: z.string().refine(
    (value) => US_STATES.includes(value),
    "Invalid U.S. state abbreviation"
  ),

  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/),

  insurance_provider: z.string().optional(),
  insurance_member_id: z.string().optional(),

  preferred_language: z.string().default("English"),

  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z
    .string()
    .regex(/^\d{10}$/)
    .optional()
});
export const updatePatientSchema = patientSchema.partial();