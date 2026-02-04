# PROMPT 16: Skills Section - 3D Technology Globe

## Task

Create skills section with interactive 3D globe visualization

## Files to Create

### 1. src/presentation/three/scenes/SkillsGlobe/SkillsGlobe.tsx

- 3D sphere with skill nodes
- Auto-rotation
- Drag to rotate

### 2. src/presentation/three/scenes/SkillsGlobe/SkillNode.tsx

- Individual skill node
- Size based on proficiency
- Color based on category
- Hover tooltip

### 3. src/presentation/three/scenes/SkillsGlobe/SkillConnections.tsx

- Lines connecting related skills
- Animated on hover

### 4. src/presentation/components/sections/Skills/Skills.tsx

- Canvas with SkillsGlobe
- Category legend
- Skill details panel

### 5. src/presentation/components/sections/Skills/SkillCategory.tsx

- Category filter buttons

### 6. src/presentation/components/sections/Skills/SkillDetail.tsx

- Detailed view on selection

### 7. Skill categories

- Languages: Python, Java, Bash, JavaScript
- Big Data: Spark, Kafka, HDFS, Hive, NiFi
- DevOps: Kubernetes, Docker, Airflow, CI/CD
- AI/ML: TensorFlow, Keras, Scikit-learn, Spark MLlib
- Databases: PostgreSQL, MongoDB, Redis, InfluxDB
- Backend: Spring Boot, Flask, FastAPI

### 8. Tests

### 9. Commit

```
feat: implement skills section with 3d globe
```

## Requirements

- Interactive and engaging
- Mobile fallback (list view)
- Update CHANGELOG.md

## Output

Interactive 3D skills visualization
