# Contributing to golemui-kendo

Thank you for your interest in contributing to `golemui-kendo`!

This project is part of the [GolemUI](https://golemui.com/) ecosystem, designed to provide seamless integration with Progress Kendo UI for Angular applications.

---

## 🛠️ Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/danywalls/golemui-kendo.git
   cd golemui-kendo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the schematic**:
   ```bash
   npm run build
   ```

4. **Run tests**:
   Tests are powered by [Vitest](https://vitest.dev/):
   ```bash
   npm test
   ```

---

## 🧪 Testing Schematics Locally in a Sample App

You can link and test your local changes in an Angular application:

1. In the `golemui-kendo` directory, build and link:
   ```bash
   npm run build
   npm link
   ```

2. In your sample Angular project directory:
   ```bash
   npm link golemui-kendo
   ng add golemui-kendo
   ```

---

## 📜 Pull Request Guidelines

1. **Create a topic branch**: `git checkout -b feat/my-new-feature` or `fix/my-bugfix`.
2. **Write clean code & tests**: Ensure all unit tests pass with `npm test`.
3. **Commit messages**: Follow conventional commit conventions (`feat:`, `fix:`, `docs:`, `refactor:`).
4. **Submit PR**: Open a Pull Request on GitHub against the `main` branch.

---

## 🔗 Related Resources

* 🌐 **GolemUI Website**: [https://golemui.com](https://golemui.com/)
* 📦 **GolemUI Core Repository**: [https://github.com/golemui/golemui](https://github.com/golemui/golemui)
