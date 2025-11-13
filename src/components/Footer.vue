<template>
  <footer class="footer bg-dark text-light py-5 mt-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4">
          <h5 class="fw-bold mb-3">
            <i class="bi bi-mortarboard-fill me-2"></i>Quizzo
          </h5>
          <p class="mb-3">
            Empowering students with interactive learning experiences. Master subjects through engaging quizzes and personalized education paths.
          </p>
          <div class="social-links">
            <a href="#" class="text-light me-3" aria-label="Facebook">
              <i class="bi bi-facebook fs-5"></i>
            </a>
            <a href="#" class="text-light me-3" aria-label="Twitter">
              <i class="bi bi-twitter fs-5"></i>
            </a>
            <a href="#" class="text-light me-3" aria-label="LinkedIn">
              <i class="bi bi-linkedin fs-5"></i>
            </a>
            <a href="#" class="text-light" aria-label="Instagram">
              <i class="bi bi-instagram fs-5"></i>
            </a>
          </div>
        </div>

        <div class="col-lg-2 col-md-3">
          <h6 class="fw-bold mb-3">Platform</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><router-link to="/home" class="text-light text-decoration-none">Home</router-link></li>
            <li class="mb-2"><router-link to="/profile" class="text-light text-decoration-none">Profile</router-link></li>
            <li class="mb-2"><a href="#" class="text-light text-decoration-none">Courses</a></li>
            <li class="mb-2"><a href="#" class="text-light text-decoration-none">Progress</a></li>
          </ul>
        </div>

        <div class="col-lg-2 col-md-3">
          <h6 class="fw-bold mb-3">Support</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="#" class="text-light text-decoration-none">Help Center</a></li>
            <li class="mb-2"><a href="#" class="text-light text-decoration-none">Contact Us</a></li>
            <li class="mb-2"><a href="#" class="text-light text-decoration-none">FAQ</a></li>
            <li class="mb-2"><a href="#" class="text-light text-decoration-none">Feedback</a></li>
          </ul>
        </div>

        <div class="col-lg-4">
          <h6 class="fw-bold mb-3">Our Mission</h6>
          <p class="mb-3">
            To revolutionize education by making learning accessible, engaging, and effective for students worldwide through innovative quiz-based assessments.
          </p>
          <div class="mission-highlights">
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              <small>Personalized Learning Paths</small>
            </div>
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              <small>Instant Feedback & Progress Tracking</small>
            </div>
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              <small>Comprehensive Subject Coverage</small>
            </div>
          </div>
        </div>
      </div>

      <hr class="my-4">

      <div class="row align-items-center">
        <div class="col-md-6">
          <p class="mb-0 small">
            &copy; Quizzo. All rights reserved. | Built with ❤️ for better education.
          </p>
        </div>
        <div class="col-md-6 text-md-end">
          <a href="#" class="text-light text-decoration-none small me-3">Privacy Policy</a>
          <a href="#" class="text-light text-decoration-none small me-3">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component - no logic needed
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-top: 3px solid #007bff;
}

.social-links a {
  transition: transform 0.3s ease, color 0.3s ease;
}

.social-links a:hover {
  transform: translateY(-2px);
  color: #007bff !important;
}

.mission-highlights small {
  color: #adb5bd;
}

.footer a:hover {
  color: #007bff !important;
}
</style>
