# PROMPT 21: Performance Optimization

## Task
Optimize performance for production

## Steps

### 1. Implement lazy loading
- Dynamic imports for 3D scenes
- Intersection Observer for sections
- Image lazy loading

### 2. Add progressive enhancement
- Detect WebGL support
- Fallback for low-end devices
- Reduced motion support

### 3. Optimize 3D
- Use InstancedMesh for particles
- Implement LOD (Level of Detail)
- Frustum culling
- Dispose unused resources

### 4. Bundle optimization
- Analyze bundle size
- Code splitting
- Tree shaking verification

### 5. Image optimization
- WebP format
- Responsive images
- Blur placeholders

### 6. Add performance monitoring
- Web Vitals tracking
- FPS counter (dev only)

### 7. Create next.config.ts optimizations
- Image domains
- Bundle analyzer

### 8. Lighthouse audit
- Target: 90+ all categories
- Fix any issues

### 9. Commit
```
perf: optimize performance for production
```

## Requirements
- Core Web Vitals green
- 60fps animations
- Update CHANGELOG.md

## Output
Optimized, production-ready website
