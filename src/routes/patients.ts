import { Router } from "express";
import { sql } from "../db/dbConfig.ts";
import { patientSchema, updatePatientSchema } from "../schema/patientSchema.ts";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const result = patientSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        data: null,
        error: result.error.flatten()
      });
    }

    const patient = result.data;

    const rows = await sql`
      INSERT INTO patients (
        first_name,
        last_name,
        date_of_birth,
        sex,
        phone_number,
        email,
        address_line_1,
        address_line_2,
        city,
        state,
        zip_code,
        insurance_provider,
        insurance_member_id,
        preferred_language,
        emergency_contact_name,
        emergency_contact_phone
      )
      VALUES (
        ${patient.first_name},
        ${patient.last_name},
        ${patient.date_of_birth},
        ${patient.sex},
        ${patient.phone_number},
        ${patient.email ?? null},
        ${patient.address_line_1},
        ${patient.address_line_2 ?? null},
        ${patient.city},
        ${patient.state},
        ${patient.zip_code},
        ${patient.insurance_provider ?? null},
        ${patient.insurance_member_id ?? null},
        ${patient.preferred_language},
        ${patient.emergency_contact_name ?? null},
        ${patient.emergency_contact_phone ?? null}
      )
      RETURNING *
    `;

    console.log("Patient created:", rows[0]);

    return res.status(201).json({
      data: rows[0],
      error: null
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      data: null,
      error: "Internal server error"
    });
  }
});
// get api endpoint to fetch all patients
router.get("/", async (req, res) => {
  try {
    const lastName =
      typeof req.query.last_name === "string"
        ? req.query.last_name
        : null;

    const dateOfBirth =
      typeof req.query.date_of_birth === "string"
        ? req.query.date_of_birth
        : null;

    const phoneNumber =
      typeof req.query.phone_number === "string"
        ? req.query.phone_number
        : null;

    const patients = await sql`
      SELECT *
      FROM patients
      WHERE deleted_at IS NULL
        AND (
          ${lastName}::text IS NULL
          OR LOWER(last_name) = LOWER(${lastName})
        )
        AND (
          ${dateOfBirth}::text IS NULL
          OR date_of_birth = ${dateOfBirth}::date
        )
        AND (
          ${phoneNumber}::text IS NULL
          OR phone_number = ${phoneNumber}
        )
      ORDER BY created_at DESC
    `;

    return res.status(200).json({
      data: patients,
      error: null
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      data: null,
      error: "Internal server error"
    });
  }
});
//get with id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const patients = await sql`
      SELECT *
      FROM patients
      WHERE patient_id = ${id}::uuid
        AND deleted_at IS NULL
      LIMIT 1
    `;

    if (patients.length === 0) {
      return res.status(404).json({
        data: null,
        error: "Patient not found"
      });
    }

    return res.status(200).json({
      data: patients[0],
      error: null
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      data: null,
      error: "Invalid patient ID"
    });
  }
});
//put api endpoint to update patient by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = updatePatientSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        data: null,
        error: result.error.flatten()
      });
    }

    const patient = result.data;

    const patients = await sql`
      UPDATE patients
      SET
        first_name = COALESCE(${patient.first_name ?? null}, first_name),
        last_name = COALESCE(${patient.last_name ?? null}, last_name),
        date_of_birth = COALESCE(${patient.date_of_birth ?? null}::date, date_of_birth),
        sex = COALESCE(${patient.sex ?? null}, sex),
        phone_number = COALESCE(${patient.phone_number ?? null}, phone_number),
        email = COALESCE(${patient.email ?? null}, email),
        address_line_1 = COALESCE(${patient.address_line_1 ?? null}, address_line_1),
        address_line_2 = COALESCE(${patient.address_line_2 ?? null}, address_line_2),
        city = COALESCE(${patient.city ?? null}, city),
        state = COALESCE(${patient.state ?? null}, state),
        zip_code = COALESCE(${patient.zip_code ?? null}, zip_code),
        insurance_provider = COALESCE(${patient.insurance_provider ?? null}, insurance_provider),
        insurance_member_id = COALESCE(${patient.insurance_member_id ?? null}, insurance_member_id),
        preferred_language = COALESCE(${patient.preferred_language ?? null}, preferred_language),
        emergency_contact_name = COALESCE(${patient.emergency_contact_name ?? null}, emergency_contact_name),
        emergency_contact_phone = COALESCE(${patient.emergency_contact_phone ?? null}, emergency_contact_phone),
        updated_at = NOW()
      WHERE patient_id = ${id}::uuid
        AND deleted_at IS NULL
      RETURNING *
    `;

    if (patients.length === 0) {
      return res.status(404).json({
        data: null,
        error: "Patient not found"
      });
    }

    return res.status(200).json({
      data: patients[0],
      error: null
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      data: null,
      error: "Invalid patient ID"
    });
  }
});

//delete api endpoint to soft delete patient by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const patients = await sql`
      UPDATE patients
      SET
        deleted_at = NOW(),
        updated_at = NOW()
      WHERE patient_id = ${id}::uuid
        AND deleted_at IS NULL
      RETURNING *
    `;

    if (patients.length === 0) {
      return res.status(404).json({
        data: null,
        error: "Patient not found"
      });
    }

    return res.status(200).json({
      data: patients[0],
      error: null
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      data: null,
      error: "Invalid patient ID"
    });
  }
});
export default router;