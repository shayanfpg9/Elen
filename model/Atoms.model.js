//Atoms schema:
const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  AtomSchema = new Schema(
    {
      name: {
        type: "string",
        unique: true,
        required: true,
      },
      appearance: {
        type: "string",
      },
      atomic_mass: {
        type: "number",
      },
      boil: {
        type: "number",
      },
      category: {
        type: "string",
      },
      density: {
        type: "number",
      },
      discovered_by: {
        type: "string",
      },
      melt: {
        type: "number",
      },
      molar_heat: {
        type: "number",
      },
      number: {
        type: "number",
        unique: true,
        required: true,
      },
      period: {
        type: "number",
      },
      group: {
        type: "number",
      },
      phase: {
        type: "string",
        enum: ["Liquid", "Gas", "Solid"],
      },
      source: {
        type: "string",
      },
      bohr_model_image: {
        type: "string",
      },
      summary: {
        type: "string",
      },
      symbol: {
        type: "string",
      },
      xpos: {
        type: "number",
      },
      ypos: {
        type: "number",
      },
      electron_configuration: {
        type: "string",
      },
      image: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          url: {
            type: "string",
          },
          attribution: {
            type: "string",
          },
        },
      },
      fa: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          appearance: {
            type: "string",
          },
          category: {
            type: "string",
          },
          discovered_by: {
            type: "string",
          },
          phase: {
            type: "string",
            enum: ["گاز", "جامد", "مایع"],
          },
          summary: {
            type: "string",
          },
          "image.title": {
            type: "string",
          },
          source: {
            type: "string",
          },
        },
        required: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Atoms", AtomSchema);
