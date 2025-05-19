// MainText.java
package com.NoIdea.Lexora.model.RoadMapModel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;


public class MainText {
    @JsonProperty("main_text_id")
    private String mainTextId;

    @JsonProperty("main_text_name")
    private String mainTextName;

    @JsonProperty("sub_category")
    private List<SubCategory> subCategory;

    public String getMainTextId() {
        return mainTextId;
    }

    public void setMainTextId(String mainTextId) {
        this.mainTextId = mainTextId;
    }

    public String getMainTextName() {
        return mainTextName;
    }

    public void setMainTextName(String mainTextName) {
        this.mainTextName = mainTextName;
    }

    public List<SubCategory> getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(List<SubCategory> subCategory) {
        this.subCategory = subCategory;
    }
}
