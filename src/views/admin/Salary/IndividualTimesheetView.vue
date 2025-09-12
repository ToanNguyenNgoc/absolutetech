<template>
  <PageContainer title="Individual Timesheet">
    <table>
      <thead>
        <tr>
          <th>JOB NUMBER</th>
          <th>DATE</th>
          <th>TIME IN</th>
          <th>TIME OUT</th>
          <th>SUPERVISOR</th>
          <th>REMARKS</th>
          <th>REMARKS 2</th>
          <th>SALARY</th>
          <th>OVERTIME</th>
          <th>PENALTY</th>
          <th>TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="parent in salaryJobNumbers" :key="parent._id">
          <td>{{ parent.code }}</td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>{{ formatDate(timesheet_detail_salary.timesheet.date_time) }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>{{ formattedTime(timesheet_detail_salary.timesheet_detail?.time_in) }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>{{ formattedTime(timesheet_detail_salary.timesheet_detail?.time_out) }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>{{ timesheet_detail_salary.timesheet_detail?.attendance?.full_name }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>{{ renderRemark(timesheet_detail_salary.timesheet_detail) }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>{{ timesheet_detail_salary.timesheet_detail?.remarks || '_' }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>$ {{ timesheet_detail_salary.total_allowance_salary }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>$ {{ timesheet_detail_salary.overtime_salary }}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>$ 0</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding: 0;">
            <table>
              <tbody>
                <tr v-for="timesheet_detail_salary in parent.timesheet_detail_salaries"
                  :key="timesheet_detail_salary._id">
                  <td>$ {{ Number(timesheet_detail_salary.overtime_salary || 0) +
                    Number(timesheet_detail_salary.total_allowance_salary) }}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </PageContainer>
</template>

<script setup>
import PageContainer from '@/components/common/PageContainer.vue';
import { useGetSalaryJobnumbers } from '@/hooks';
import { formatDate, formattedTime } from '@/utils/common';
import { reactive } from 'vue';

const params = reactive({
  page: 1,
  limit: 10,
});

const { salaryJobNumbers } = useGetSalaryJobnumbers(params);
const renderRemark = (timesheet_detail)=>{
  let note = '_';
  if(!timesheet_detail) return note;
  if(timesheet_detail.on_rope) note = 'ON ROPE';
  if(timesheet_detail.in_charge) note = note + ', IN CHARGE';
  if(timesheet_detail.other) note = note + ', OTHER';
  if(timesheet_detail.is_night_job) note = note + ', NIGHT JOB';
  if(timesheet_detail.is_indoor) note = note + ', INDOOR';
  return note;
}

</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Arial', sans-serif;
  font-size: 14px;
}

th,
td {
  border: 1px solid #e0e0e0;
  text-align: left;
  padding: 12px 10px;
  color: #333;
  font-size: 10px;
}

th {
  background-color: #f2f2f2;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

tr:nth-child(even) {
  background-color: #f6f8fa;
}

tr:hover {
  background-color: #eef2f7;
}
</style>