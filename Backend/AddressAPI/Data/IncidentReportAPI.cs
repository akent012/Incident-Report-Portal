using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using IncidentAPI.Models;

namespace IncidentAPI.Data
{
    public class IncidentReportAPI : IDisposable
    {
        private SqlConnection readConn;
        private SqlConnection writeConn;

        private void connection()
        {
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder
            {
                DataSource = "TONY5IPRO\\SQLEXPRESS",
                UserID = "IR_USR",
                Password = "Anthony!2004",
                InitialCatalog = "apIR"
            };

            string constring = builder.ToString();
            readConn = new SqlConnection(constring);
            writeConn = new SqlConnection(constring);
        }

        /// <summary>
        /// Retrieves all incident types from the database.
        /// </summary>
        /// <returns>List of IncidentTypeModel objects</returns>
        public List<IncidentTypeModel> GetIncidentTypes()
        {
            connection();
            List<IncidentTypeModel> incidentTypes = new List<IncidentTypeModel>();

            try
            {
                string query = "SELECT ID, IncidentType, Definition, Examples FROM IncidentTypes";

                using (SqlCommand cmd = new SqlCommand(query, readConn))
                {
                    readConn.Open();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            incidentTypes.Add(new IncidentTypeModel
                            {
                                ID = dr["ID"] != DBNull.Value ? Convert.ToInt32(dr["ID"]) : 0,
                                IncidentType = dr["IncidentType"] != DBNull.Value ? dr["IncidentType"].ToString() : null,
                                Definition = dr["Definition"] != DBNull.Value ? dr["Definition"].ToString() : null,
                                Examples = dr["Examples"] != DBNull.Value ? dr["Examples"].ToString() : null
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error fetching incident types: " + ex.Message);
            }
            finally
            {
                if (readConn.State == ConnectionState.Open)
                {
                    readConn.Close();
                }
            }

            return incidentTypes;
        }

        /// <summary>
        /// Retrieves incident questions by IncidentTypeID.
        /// </summary>
        /// <param name="incidentTypeId">The ID of the incident type.</param>
        /// <returns>List of IncidentQuestionModel objects.</returns>
        public async Task<List<IncidentQuestionModel>> GetIncidentQuestionsByTypeIdAsync(int incidentTypeId)
        {
            connection();
            List<IncidentQuestionModel> incidentQuestions = new List<IncidentQuestionModel>();

            try
            {
                string query = "EXEC [dbo].[GetIncidentQuestions] @IncidentTypeID";

                using (SqlCommand cmd = new SqlCommand(query, readConn))
                {
                    cmd.Parameters.AddWithValue("@IncidentTypeID", incidentTypeId);
                    await readConn.OpenAsync();

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            incidentQuestions.Add(new IncidentQuestionModel
                            {
                                QuestionID = dr["QuestionID"] != DBNull.Value ? Convert.ToInt32(dr["QuestionID"]) : 0,
                                IncidentTypeID = dr["IncidentTypeID"] != DBNull.Value ? Convert.ToInt32(dr["IncidentTypeID"]) : 0,
                                QuestionText = dr["QuestionText"] != DBNull.Value ? dr["QuestionText"].ToString() : null,
                                IsRequired = dr["IsRequired"] != DBNull.Value ? Convert.ToBoolean(dr["IsRequired"]) : false,
                                QuestionOrder = dr["QuestionOrder"] != DBNull.Value ? Convert.ToInt32(dr["QuestionOrder"]) : 0
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error fetching incident questions: " + ex.Message);
            }
            finally
            {
                if (readConn.State == ConnectionState.Open)
                {
                    readConn.Close();
                }
            }

            return incidentQuestions;
        }

        public bool InsertIncidentReport(IncidentReportModel record)
        {
            try
            {
                connection(); // Assuming this method initializes `writeToConn` (the SqlConnection object)
                string storedProcedure = "[dbo].[InsertIncidentReport]"; // Update stored procedure name if necessary

                using (SqlCommand cmd = new SqlCommand(storedProcedure, writeConn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@IncidentTypeID", SqlDbType.Int).Value = record.IncidentTypeID;
                    cmd.Parameters.Add("@IncidentType", SqlDbType.NVarChar, 50).Value = record.IncidentType ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@FirstName", SqlDbType.NVarChar, 50).Value = record.FirstName ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@LastName", SqlDbType.NVarChar, 50).Value = record.LastName ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@HomeAddress", SqlDbType.NVarChar, 200).Value = record.HomeAddress ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@PhoneNumber", SqlDbType.NVarChar, 20).Value = record.PhoneNumber ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 50).Value = record.Email ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@Race", SqlDbType.NVarChar, 50).Value = record.Race ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@Ethnicity", SqlDbType.NVarChar, 50).Value = record.Ethnicity ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@DOB", SqlDbType.NVarChar, 50).Value = record.DOB ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@Sex", SqlDbType.NVarChar, 10).Value = record.Sex ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@DriverLicenseNum", SqlDbType.NVarChar, 30).Value = record.DriverLicenseNum ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@LicenseState", SqlDbType.NVarChar, 20).Value = record.LicenseState ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@Age", SqlDbType.Int).Value = record.Age;
                    cmd.Parameters.Add("@IncidentDetails", SqlDbType.NVarChar, 1000).Value = record.IncidentDetails ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@Narrative", SqlDbType.NVarChar, 5000).Value = record.Narrative ?? (object)DBNull.Value;

                    writeConn.Open();
                    cmd.ExecuteNonQuery();
                    writeConn.Close();

                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error adding record: " + ex.Message);
                return false;
            }
            finally
            {
                if (writeConn.State == ConnectionState.Open)
                {
                    writeConn.Close();
                }
            }
        }


        public void Dispose()
        {
            if (readConn != null)
            {
                readConn.Dispose();
            }

            if (writeConn != null)
            {
                writeConn.Dispose();
            }
        }
    }
}
