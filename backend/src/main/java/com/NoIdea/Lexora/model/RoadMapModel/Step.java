package com.NoIdea.Lexora.model.RoadMapModel;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Step {
    @JsonProperty("steps_id")
    private String stepsId;

    @JsonProperty("steps_description")
    private String stepsDescription;

    public String getStepsId() {
        return stepsId;
    }
    public void setStepsId(String stepsId) {
        this.stepsId = stepsId;
    }

    public String getStepsDescription() {
        return stepsDescription;
    }
    public void setStepsDescription(String stepsDescription) {
        this.stepsDescription = stepsDescription;
    }
}
