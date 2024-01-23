<template>
  <div>
    <div class="pt-10">
      <h1 class="title text-lg font-medium">Student Evaluations</h1>
      <p class="titleDes text-sm font-light">
        The evaluations made by the lecturers
      </p>
    </div>
    <div class="w-4/5 pt-10 h-full">
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
                <h1 class="title mb-2">Evaluation Details</h1>
                <v-table class="border">
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
                <div class="mt-5">
                  <h1 class="title mb-2">Notes for Coordinator</h1>
                  <v-sheet
                    class="p-4 rounded-t-lg h-32 max-h-32 overflow-y-scroll no-scrollbar"
                    elevation="4"
                    color="amber-lighten-4"
                  >
                    <h1>{{ item.remarksForCord }}</h1>
                  </v-sheet>
                </div>
                <h1 class="title mt-2">
                  Final Mark
                  <v-chip class="ma-2" label color="teal" variant="elevated">
                    {{ item.finalMark.totalMarks }}
                  </v-chip>
                  /
                  <v-chip class="ma-2" label color="pink" variant="elevated">
                    {{ item.finalMark.totalOutOf }}
                  </v-chip>
                </h1>

                <div v-if="item.selectedCriteriaData">
                  <small class="title mt-5">
                    {{ item.selectedCriteriaData.criteriaName }} ({{
                      item.selectedCriteriaData.criteriaProgram
                    }}) - {{ item.selectedCriteriaData.criteriaTotalMark }}
                  </small>
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
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.finalMark="{ item }">
          {{ item.finalMark.totalMarks }}
          /
          {{ item.finalMark.totalOutOf }}
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
    <AdminCriteria
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
import AdminCriteria from "./adminCriteria.vue";

const search = ref("");
const headers = ref([
  { key: "evaluationId", sortable: false, title: "ID" },
  { key: "lecturerName", sortable: false, title: "Lecturer" },
  { key: "typeOfEvaluator", sortable: false, title: "Type of Evaluator" },
  { key: "studentName", sortable: false, title: "Student" },
  { key: "createdAt", sortable: true, title: "Date" },
  { key: "finalMark", sortable: false, title: "Final Mark" },
  { key: "evaluationObjects", sortable: true, title: "Action" },
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
  };
  const remarksForCord = item.remarksForCord;
  const finalMarkTotal = item.finalMark.totalMarks;
  const finalMarkOutOf = item.finalMark.totalOutOf;
  const evaluationDataForPdf = Object.entries(item.evaluationObjects).map(
    ([key, evaluationObject]) => ({
      criteria: key,
      mark: evaluationObject.mark,
      outOf: evaluationObject.outOf,
    })
  );
  const matchingCriteria = criteriasData.value.find(
    (criteria) => criteria.criteriaProgram === item.criteriaProgram
  );

  const criteriaNameDiv = matchingCriteria
    ? `<div style="width:100%; text-align: center; margin-top:20px; font-size:16px;"><h1><strong>${matchingCriteria.criteriaName} (${matchingCriteria.criteriaProgram})</strong> </h1></div>`
    : "";

  return `
    <div style="padding: 20px;">
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
          <p>Program: ${studentDetails.program}</p>
        </div>
      </div>
      <h1 style="margin-top:40px;"><strong>Evaluation Details</strong></h1>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Criteria</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Mark</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Out Of</th>
          </tr>
        </thead>
        <tbody>
          ${evaluationDataForPdf
            .map(
              (evaluationObject) => `
                <tr>
                  <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${evaluationObject.criteria}</td>
                  <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${evaluationObject.mark}</td>
                  <td style="text-align: center; border: 1px solid #ddd; padding: 8px;">${evaluationObject.outOf}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      <h1 style="margin-top:40px;"><strong>Final Mark:</strong> ${finalMarkTotal} / ${finalMarkOutOf}</h1>
      <h1 style="margin-top:40px;"><strong>Notes for Coordinator</strong></h1>
      <p>${remarksForCord}</p>
    </div>
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
  try {
    const response = await axios.get(`${apiUrl}/evaluations`, {
      headers: {
        Authorization: token,
      },
    });
    evaluationData.value = response.data.map((evaluation) => {
      return {
        ...evaluation,
        createdAt: formatDate(evaluation.createdAt),
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

const formatDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-US", {
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
