package com.NoIdea.Lexora.model.RoadMapModel;


import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonProperty;


import java.util.List;
import java.util.Map;


@Document(collection = "roadmaps")
public class Roadmap {
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getrId() {
        return rId;
    }

    public void setrId(String rId) {
        this.rId = rId;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public List<MainText> getMainText() {
        return mainText;
    }

    public void setMainText(List<MainText> mainText) {
        this.mainText = mainText;
    }

    public Map<String, ProgressItem> getProgress() {
        return progress;
    }

    public void setProgress(Map<String, ProgressItem> progress) {
        this.progress = progress;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Id
    private String id;


    @Field("r_Id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("r_Id")
    private String rId;

    @Field("job_name")
    @JsonProperty("job_name")
    private String jobName;

    @Field("main_text")
    @JsonProperty("main_text")
    private List<MainText> mainText;

    private Map<String, ProgressItem> progress;

    @Field("userId")
    private Integer userId;

    // Getters and setters omitted for brevity

    public static class ProgressItem {
        private String status;
        private String notes;

        public ProgressItem() {}
        public ProgressItem(String status, String notes) {
            this.status = status;
            this.notes = notes;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}





