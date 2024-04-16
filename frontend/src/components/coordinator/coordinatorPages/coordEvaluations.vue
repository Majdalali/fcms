<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Student Evaluations</h1>
      <p class="titleDes text-sm font-light">
        The evaluations made by the lecturers
      </p>
    </div>
    <div class="md:w-4/5 pt-10 h-full">
      <v-card :rounded="0" :elevation="0">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          single-line
          :rounded="0"
          variant="outlined"
          hide-details
        ></v-text-field>
      </v-card>
      <v-data-table :headers="headers" :items="evaluationData" :search="search">
        <template v-slot:item.evaluationObjects="{ item }">
          <v-btn @click="openDialog(item)" size="small" color="primary">
            Details
          </v-btn>
          <v-dialog v-model="item.dialog" width="800">
            <v-card>
              <v-card-text class="mt-4">
                <h1 class="title mb-2">
                  Evaluation Details: {{ item.projectType }}
                </h1>
                <v-table v-if="item.evalType == 'split'" class="border">
                  <thead>
                    <tr>
                      <th class="text-center text-base">Criteria</th>
                      <th class="text-center text-base">Grade</th>
                      <th class="text-center text-base">Out Of</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(evaluationObject, key) in item.evaluationObjects"
                      :key="key"
                    >
                      <td class="text-center text-base">
                        {{ key }}
                      </td>
                      <td class="text-center text-base">
                        {{ evaluationObject.mark }}
                      </td>
                      <td class="text-center text-base">
                        {{ evaluationObject.outOf }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                <v-table v-if="item.evalType == 'questionnaire'" class="border">
                  <thead>
                    <tr>
                      <th class="text-center text-base">Criteria</th>
                      <th class="text-center text-base">Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, key) in item.evaluationObjects"
                      :key="key"
                    >
                      <td class="text-center text-base">
                        {{ key }}
                      </td>
                      <td class="text-center text-base">
                        {{ value }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                <div class="mt-5">
                  <h1 class="title mb-2">Notes for Coordinator</h1>
                  <v-text-field readonly>
                    <h1>{{ item.remarksForCord }}</h1>
                  </v-text-field>
                </div>
                <h1 v-if="item.evalType == 'split'" class="title">
                  Final Mark:
                  <v-chip class="ma-2" label color="teal" variant="elevated">
                    {{ item.finalMark.totalMarks }}
                  </v-chip>
                  /
                  <v-chip class="ma-2" label color="pink" variant="elevated">
                    {{ item.finalMark.totalOutOf }}
                  </v-chip>
                </h1>
                <h1 class="title">
                  {{ item.evalType == "split" ? "Grade" : "Results" }}:
                  <v-tooltip
                    v-if="item.evalType == 'split'"
                    text="Grade is calculated based on the final mark and the Examiner/Supervisor's grading percentage."
                  >
                    <template v-slot:activator="{ props }">
                      <v-chip
                        v-bind="props"
                        class="ma-2"
                        label
                        color="indigo"
                        variant="elevated"
                      >
                        {{ item.grade }}
                      </v-chip></template
                    >
                  </v-tooltip>
                  <v-tooltip v-else :text="getText(item.grade)">
                    <template v-slot:activator="{ props }">
                      <v-chip
                        v-bind="props"
                        class="ma-2"
                        label
                        color="indigo"
                        variant="elevated"
                      >
                        {{ item.grade.toUpperCase() }}
                      </v-chip></template
                    >
                  </v-tooltip>
                </h1>
                <!-- Fetch files from supportingDocs array in a herf link a tag -->
                <div class="mt-5" v-if="item.supportingDocs.length > 0">
                  <h1 class="title mb-2">Supporting Documents</h1>
                  <v-row>
                    <v-col v-for="file in item.supportingDocs">
                      <a
                        :href="`${apiUrl}/files/${file}`"
                        target="_blank"
                        class="text-indigo-500"
                        >{{ file }}</a
                      >
                    </v-col>
                  </v-row>
                </div>
                <div class="text-start mt-5 text-base">
                  <v-btn @click="downloadPdf(item)" color="indigo">
                    Download Evaluation
                  </v-btn>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="warning"
                  variant="outlined"
                  class="w-32"
                  text="Cancel"
                  @click="closeDialog(item)"
                ></v-btn>
              </v-card-actions> </v-card></v-dialog
        ></template>
        <template v-slot:item.finalMark="{ item }">
          <div v-if="item.evalType == 'split'">
            {{ item.finalMark.totalMarks }}
            /
            {{ item.finalMark.totalOutOf }}
          </div>
          <div v-else>
            {{ item.grade.toUpperCase() }}
          </div>
        </template>
        <template v-slot:item.download="{ item }">
          <v-btn @click="downloadPdf(item)" size="small" color="indigo">
            Download
          </v-btn></template
        >
      </v-data-table>
      <div class="mt-4">
        <h1 class="title mb-2">Download All Evaluations</h1>
        <v-btn @click="downloadAllPdf(evaluationData)" color="indigo">
          Download
        </v-btn>
        <div class="text-center mt-4">
          <v-progress-linear
            :height="10"
            striped
            stream
            :buffer-value="progressCircular + progressCircular / 2"
            :model-value="progressCircular"
            v-if="progressCircular !== 0"
            color="amber"
          >
          </v-progress-linear>
        </div>
      </div>
    </div>
    <CoordCriteria
      :criteriaData="criteriasData"
      :programsData="currnetPrograms"
    />
    <v-snackbar
      :timeout="2000"
      color="indigo"
      variant="elevated"
      v-model="snackbar"
    >
      {{ responseMessage }}

      <template v-slot:actions>
        <v-btn color="white" variant="transparent" @click="snackbar = false">
          X
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import html2pdf from "html2pdf.js";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import utmLogo from "@/assets/images/utmLogo.png";
import CoordCriteria from "./coordCriteria.vue";

const search = ref("");
const headers = ref([
  { key: "lecturerName", sortable: false, title: "Lecturer" },
  { key: "typeOfEvaluator", sortable: true, title: "Type of Evaluator" },
  { key: "studentName", sortable: false, title: "Student" },
  { key: "matricNumber", sortable: false, title: "Matric No." },
  { key: "projectType", sortable: true, title: "Project Type" },
  { key: "createdAt", sortable: true, title: "Date" },
  { key: "finalMark", sortable: false, title: "Final Mark" },
  { key: "evaluationObjects", sortable: false, title: "Action" },
  { key: "download", sortable: false, title: "Download" },
]);

const evaluationData = ref([]);
const criteriasData = ref([]);
const progressCircular = ref(0);
const snackbar = ref(false);
const responseMessage = ref("");
const currnetPrograms = ref({});
const apiUrl = import.meta.env.VITE_API_URL;

// Download PDF Method
const downloadAllPdf = async (evaluationData) => {
  const batchSize = 10;
  const zip = new JSZip();
  const pdfOptions = {
    margin: 10,
    filename: "evaluation.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  const totalPDFs = evaluationData.length;
  let downloadedPDFs = 0;

  for (let i = 0; i < evaluationData.length; i += batchSize) {
    const batch = evaluationData.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (item) => {
        const pdfContent = generatePdfContent(item);
        const blob = await html2pdf()
          .from(pdfContent)
          .set(pdfOptions)
          .outputPdf("blob");
        zip.file(`evaluation_${item.evaluationId}.pdf`, blob);

        downloadedPDFs++;
        progressCircular.value = (downloadedPDFs / totalPDFs) * 100;
      })
    );
  }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "all_evaluations.zip");
    snackbar.value = true;
    responseMessage.value = "Download completed";
    progressCircular.value = 0; // Reset progress
  });
};

// PDF

const generatePdfContent = (item) => {
  const logoUrl = utmLogo;
  const lecturerDetails = {
    name: item.lecturerName,
    position: item.typeOfEvaluator,
  };
  const studentDetails = {
    name: item.studentName,
    program: item.criteriaProgram,
    matricNumber: item.matricNumber,
  };
  const remarksForCord = item.remarksForCord;
  const finalMarkTotal = item.finalMark.totalMarks;
  const finalMarkOutOf = item.finalMark.totalOutOf;
  const tableHeaders = () => {
    if (item.evalType === "split") {
      return `
                  <tr>
                    <th style="text-align: center; border: 1px solid #ddd; padding: 8px;">Criteria</th>
                    <th style="text-align: center; border: 1px solid #ddd; padding: 8px;">Grade</th>
                    <th style="text-align: center; border: 1px solid #ddd; padding: 8px;">Out Of</th>
                  </tr>
                `;
    } else {
      return `
                  <tr>
                    <th style="text-align: center; border: 1px solid #ddd; padding: 8px;">Criteria</th>
                    <th style="text-align: center; border: 1px solid #ddd; padding: 8px;">Answer</th>
                  </tr>
                `;
    }
  };
  const tableValues = () => {
    if (item.evalType === "split") {
      return ` ${evaluationDataForPdf
        .map(
          (evaluationObject) => `
                  <tr>
                    <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${evaluationObject.criteria}</td>
                    <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${evaluationObject.mark}</td>
                    <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${evaluationObject.outOf}</td>
                  </tr>
                `
        )
        .join("")}`;
    } else {
      return ` ${evaluationDataForPdf
        .map(
          (evaluationObject) => `
                  <tr>
                    <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${evaluationObject.criteria}</td>
                    <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${evaluationObject.answer}</td>
                  </tr>
                `
        )
        .join("")}`;
    }
  };
  const finalMarks = () => {
    if (item.evalType === "split") {
      return `
                <h1 style="margin-top:40px;"><strong>Final Mark:</strong> ${finalMarkTotal} / ${finalMarkOutOf}</h1>
                <h1 style="margin-top:2px;"><strong>Grade:</strong> ${item.grade}</h1>
              `;
    } else {
      return `
                <h1 style="margin-top:40px;"><strong>Results:</strong> ${item.grade.toUpperCase()}</h1>
              `;
    }
  };
  let evaluationDataForPdf = [];
  if (item.evalType === "split") {
    evaluationDataForPdf = Object.entries(item.evaluationObjects).map(
      ([key, evaluationObject]) => ({
        criteria: key,
        mark: evaluationObject.mark,
        outOf: evaluationObject.outOf,
      })
    );
  } else {
    evaluationDataForPdf = Object.entries(item.evaluationObjects).map(
      ([key, evaluationObject]) => ({
        criteria: key,
        answer: evaluationObject,
      })
    );
  }
  const matchingCriteria = criteriasData.value.find(
    (criteria) => criteria.criteriaProgram === item.criteriaProgram
  );

  const criteriaNameDiv = matchingCriteria
    ? `<div style="width:100%; text-align: center; margin-top:20px; font-size:16px;"><h1><strong>${matchingCriteria.criteriaName} (${matchingCriteria.criteriaProgram})</strong> </h1></div>`
    : "";

  return `
  <html style="height: 100%;">
    <head>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        body {
          height: 100vh;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div style="padding: 20px; height:100vh">
        <div style="width:100%; display:flex; flex-direction:row;  justify-content: space-between;">
          <img src="${logoUrl}" alt="Logo" style="width: 300px; ">
          <div style="text-align: center;">
            <h1>FACULTY OF COMPUTING</h1>
            <h1>UNIVERSITY TEKNOLOGI MALAYSIA</h1>
          </div>
        </div>
        ${criteriaNameDiv}
        <div style="margin-top:40px; width:80%; display:flex; flex-direction:row;  justify-content: space-between;">
          <div>
            <h1><strong>Lecturer Details</strong></h1>
            <p>Name: ${lecturerDetails.name}</p>
            <p>Position: ${lecturerDetails.position}</p>
          </div>
          <div>
            <h1><strong>Student Details</strong></h1>
            <p>Name: ${studentDetails.name}</p>
            <p>Matric No.: ${studentDetails.matricNumber}</p>
            <p>Program: ${studentDetails.program}</p>
          </div>
        </div>
        <h1 style="margin-top:40px;"><strong>Evaluation Details</strong></h1>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            ${tableHeaders()}
          </thead>
          <tbody>
            ${tableValues()}
          </tbody>
        </table>
        ${finalMarks()}
        <h1 style="margin-top:40px;"><strong>Notes for Coordinator</strong></h1>
        <p>${remarksForCord}</p>
        <div style="position:absolute; bottom:4px; width:100%; text-align: center;">
          <p>${item.createdAt}</p>
        </div>
      </div>
    </body>
  </html>
`;
};

const downloadPdf = async (item) => {
  const pdfContent = generatePdfContent(item);
  const options = {
    margin: 10,
    filename: `evaluation_${item.evaluationId}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    const pdfBlob = await new Promise((resolve, reject) => {
      html2pdf(pdfContent, options).outputPdf((blob) => resolve(blob), reject);
    });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `evaluation_${item.evaluationId}.pdf`;

    // Trigger the download
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
  // Set snackbar and message when download is successful
};

// Functions
onMounted(async () => {
  const token = localStorage.getItem("access_token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userProgram = storedUser.coordinator_program;
  try {
    const response = await axios.get(`${apiUrl}/evaluations/${userProgram}`, {
      headers: {
        Authorization: token,
      },
    });
    evaluationData.value = response.data.map((evaluation) => {
      return {
        ...evaluation,
        createdAt: formatDate(evaluation.createdAt),
        projectType:
          evaluation.projectType === "pOne" ? "Project 1" : "Project 2",
      };
    });
  } catch (error) {
    console.error("Error fetching proposal files:", error);
    // Handle error
  }
  // Fetch criteria data
  try {
    const response = await axios.get(`${apiUrl}/api/criterias`);
    if (response.status === 200) {
      // Handle success
      criteriasData.value = response.data;
    } else {
      // Handle other status codes or errors
      console.error("Error fetching evaluation criteria:", response.data);
      // Optionally, display an error message
    }
  } catch (error) {
    console.error("Error fetching evaluation criteria:", error);
    // Handle error, display an error message, or redirect if needed
  }
  try {
    const response = await axios.get(`${apiUrl}/api/programs`);
    if (response.status === 200) {
      currnetPrograms.value = response.data.programs;
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching programs:", error);
  }
});

const getText = (grade) => {
  switch (grade) {
    case "a":
      return "No correction";
    case "b1":
      return "One month correction";
    case "b2":
      return "Three months correction";
    case "c1":
      return "Six months correction";
    case "c2":
      return "Six months correction and Re-Presentation";
    default:
      return ""; // Or any default message you want to show if grade is not matched
  }
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-UK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

// Function to open the dialog and set selectedItem
const openDialog = (item) => {
  item.dialog = true;

  // Get the criteriaProgram from the selected evaluation item
  const criteriaProgram = item.criteriaProgram;

  // Filter criteriasData based on criteriaProgram
  const matchingCriterias = criteriasData.value.filter(
    (criteria) => criteria.criteriaProgram === criteriaProgram
  );

  // Update the selectedCriteriaData with the matching criterias
  item.selectedCriteriaData = matchingCriterias[0];
};

// Function to close the dialog and reset selectedItem
const closeDialog = (item) => {
  item.dialog = false;
};
</script>

<style lang="scss" scoped>
.title {
  font-family: "DM Sans", sans-serif;
}
.titleDes {
  font-family: "Work Sans", sans-serif;
  font-size: 1rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
.commentContent {
  font-family: "Source Sans Pro", sans-serif;
}
</style>
