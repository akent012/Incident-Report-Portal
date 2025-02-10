using System.ComponentModel.DataAnnotations;

namespace IncidentAPI.Models
{

    public class IncidentTypeModel
    {
        [Key]
        public int ID { get; set; } // Primary key, auto-incremented

        [Required, MaxLength(100)]
        public string IncidentType { get; set; } // Type of incident (matches NVARCHAR(100))

        [Required]
        public string Definition { get; set; } // Description of the incident (matches NVARCHAR(MAX))

        [Required]
        public string Examples { get; set; } // Example scenarios (matches NVARCHAR(MAX))
    }


    public class IncidentQuestionModel
    {
        [Key]
        public int QuestionID { get; set; } // Primary key, auto-incremented

        [Required]
        public int IncidentTypeID { get; set; } // Foreign key to IncidentType

        [Required, MaxLength(255)]
        public string QuestionText { get; set; } // The question text (matches NVARCHAR(255))

        [Required]
        public bool IsRequired { get; set; } // Whether the question is mandatory (matches BIT)

        [Required]
        public int QuestionOrder { get; set; } // The order in which questions are displayed
    }
    public class IncidentReportModel
    {
        [Key]
        public int Id { get; set; } // Primary key, auto-incremented

        [Required]
        public int IncidentTypeID { get; set; } // Foreign key to IncidentType

        [Required, MaxLength(50)]
        public string IncidentType { get; set; } // The type of incident

        [Required, MaxLength(50)]
        public string FirstName { get; set; } // First name of the individual

        [Required, MaxLength(50)]
        public string LastName { get; set; } // Last name of the individual

        [Required, MaxLength(200)]
        public string HomeAddress { get; set; } // Home address

        [Required, MaxLength(20)]
        public string PhoneNumber { get; set; } // Phone number

        [Required, MaxLength(50)]
        public string Email { get; set; } // Email address

        [Required, MaxLength(50)]
        public string Race { get; set; } // Race of the individual

        [Required, MaxLength(50)]
        public string Ethnicity { get; set; } // Ethnicity of the individual

        [Required, MaxLength(50)]
        public string DOB { get; set; } // Date of birth

        [Required, MaxLength(10)]
        public string Sex { get; set; } // Gender of the individual

        [Required, MaxLength(30)]
        public string DriverLicenseNum { get; set; } // Driver's license number

        [Required, MaxLength(20)]
        public string LicenseState { get; set; } // State of the driver's license

        [Required]
        public int Age { get; set; } // Age of the individual

        [Required, MaxLength(1000)]
        public string IncidentDetails { get; set; } // Details about the incident

        [Required, MaxLength(2000)]
        public string Narrative { get; set; } // Narrative of the incident
    }


}
