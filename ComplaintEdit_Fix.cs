// แก้ไข ComplaintEdit method ใน Controller
[HttpPost("ComplaintEdit")]
public async Task<IActionResult> ComplaintEdit([FromForm] string complaintPayloadJson,
                                       [FromForm] List<IFormFile> complaintFiles)
{
    ComplaintPayload? ComplaintPayload = null;
    ResultComplaintModel ResultModel = new ResultComplaintModel();

    try
    {
        // -------------------- Deserialize -------------------- //
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        ComplaintPayload = JsonSerializer.Deserialize<ComplaintPayload>(complaintPayloadJson, options);

        if (ComplaintPayload == null || ComplaintPayload.ComplaintModel == null)
            throw new Exception("ไม่พบข้อมูล ComplaintPayload");
    }
    catch (Exception ex)
    {
        return BadRequest(new
        {
            status = "error",
            message = "Deserialize ComplaintPayload failed",
            detail = ex.Message
        });
    }

    // -------------------- Map File -------------------- //
    if (ComplaintPayload?.ComplaintModel?.ComplaintFile != null)
    {
        var fileModelsFromJson = ComplaintPayload.ComplaintModel.ComplaintFile;

        ComplaintPayload.ComplaintModel.ComplaintFile = fileModelsFromJson
            .Select(jsonData =>
            {
                var matchingFile = complaintFiles.FirstOrDefault(f => f.FileName == jsonData.user_file_name);

                if (matchingFile != null)
                {
                    return new ComplaintFileModel
                    {
                        postedFile = matchingFile,
                        file_name = jsonData.file_name ?? matchingFile.FileName,
                        cf_file_seq = jsonData.cf_file_seq,
                        user_file_name = jsonData.user_file_name,
                        cf_type = jsonData.cf_type,
                        complaint_id = jsonData.complaint_id,
                        complaint_at_id = jsonData.complaint_at_id,
                        explain_id = jsonData.explain_id,
                        approve_step = jsonData.approve_step,
                        file_type = jsonData.file_type,
                        file_size = jsonData.file_size,
                        record_status = jsonData.record_status,
                        create_by = ComplaintPayload.ComplaintModel.create_by,
                        // ✅ เพิ่มบรรทัดนี้
                        other = jsonData.other
                    };
                }
                return jsonData; // ถ้าไม่มีไฟล์ใหม่ ก็ใช้ข้อมูลเดิม (edit case)
            })
            .Where(f => f != null)
            .ToList()!;
    }

    // ... ส่วนที่เหลือเหมือนเดิม
}

