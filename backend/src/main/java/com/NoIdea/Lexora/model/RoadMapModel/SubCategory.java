
// SubCategory.java
package com.NoIdea.Lexora.model.RoadMapModel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

public class SubCategory {
    @JsonProperty("sub_id")
    private String subId;

    @JsonProperty("sub_name")
    private String subName;

    @JsonProperty("sub_description")
    private String subDescription;

    @JsonProperty("sub_steps")
    private List<Step> subSteps;

    public String getSubId() {
        return subId;
    }

    public void setSubId(String subId) {
        this.subId = subId;
    }

    public String getSubName() {
        return subName;
    }

    public void setSubName(String subName) {
        this.subName = subName;
    }

    public String getSubDescription() {
        return subDescription;
    }

    public void setSubDescription(String subDescription) {
        this.subDescription = subDescription;
    }

    public List<Step> getSubSteps() {
        return subSteps;
    }

    public void setSubSteps(List<Step> subSteps) {
        this.subSteps = subSteps;
    }
}