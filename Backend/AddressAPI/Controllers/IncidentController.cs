using IncidentAPI.Data;
using Microsoft.AspNetCore.Mvc;
using IncidentAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class IncidentController : ControllerBase
{
    private readonly IncidentReportAPI _incidentReportApi;

    public IncidentController()
    {
        _incidentReportApi = new IncidentReportAPI();
    }

    [HttpGet("readIncidentTypes")]
    public async Task<IActionResult> ReadIncidentTypes()
    {
        try
        {
            // Fetch data from the IncidentTypes table using IncidentReportAPI
            List<IncidentTypeModel> incidentTypes = _incidentReportApi.GetIncidentTypes();

            if (incidentTypes == null || !incidentTypes.Any())
            {
                return NotFound(new { message = "No incident types found." });
            }

            return Ok(incidentTypes); // Return the list of incident types
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while fetching incident types.", details = ex.Message });
        }
    }

    [HttpGet("readIncidentQuestions/{incidentTypeId}")]
    public async Task<IActionResult> ReadIncidentQuestions(int incidentTypeId)
    {
        try
        {
            // Fetch incident questions using the service/repository layer
            List<IncidentQuestionModel> incidentQuestions = await _incidentReportApi.GetIncidentQuestionsByTypeIdAsync(incidentTypeId);

            if (incidentQuestions == null || !incidentQuestions.Any())
            {
                return NotFound(new { message = "No questions found for the specified incident type." });
            }

            return Ok(incidentQuestions); // Return the list of incident questions
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while fetching incident questions.", details = ex.Message });
        }
    }


    [HttpPost("createIncidentReport")]
    public async Task<IActionResult> createIncidentReport([FromBody] IncidentReportModel record)
    {
        try
        {
            // Validate the data model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool isAdded = _incidentReportApi.InsertIncidentReport(record);

            if (isAdded)
            {
                return Ok(new { message = "Record added successfully." });
            }
            else
            {
                return StatusCode(500, new { error = "An error occurred while adding the record." });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }

}
