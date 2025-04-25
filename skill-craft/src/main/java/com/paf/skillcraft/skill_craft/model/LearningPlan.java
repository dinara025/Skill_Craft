package com.paf.skillcraft.skill_craft.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "learning_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPlan {
    @Id
    private String id;

    private String userId;
    private String title;
    private String description;
    private List<String> topics;
    private List<String> resources;
    private LocalDate targetCompletionDate;
    private boolean completed;
}