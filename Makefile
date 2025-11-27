# Defaults (override via environment or on the command line)
OWNER ?= kennguyen722
REPO  ?= Interview
BRANCH ?= master
MAVEN_IMAGE ?= maven:3.9.9-eclipse-temurin-17

.PHONY: test-auth test-user test-scim test-all protect unprotect

# Run auth-service tests with Dockerized Maven
test-auth:
	docker run --rm \
	  -v "$(PWD)/identity_management_platform/auth-service:/ws" \
	  -w /ws $(MAVEN_IMAGE) mvn -B test

# Run user-service tests with Dockerized Maven
test-user:
	docker run --rm \
	  -v "$(PWD)/identity_management_platform/user-service:/ws" \
	  -w /ws $(MAVEN_IMAGE) mvn -B test

# Run scim-service tests with npm
test-scim:
	cd identity_management_platform/scim-service && npm test

# Run all tests
test-all: test-auth test-user test-scim

# Protect branch using GitHub API (requires GITHUB_TOKEN)
protect:
	@if [ -z "$$GITHUB_TOKEN" ]; then \
	  echo "Error: GITHUB_TOKEN not set" 1>&2; exit 1; \
	fi
	echo '{"required_status_checks":{"strict":true,"contexts":["CI / test"]},"enforce_admins":true,"required_pull_request_reviews":{"required_approving_review_count":1},"restrictions":null}' \
	| curl -sSf -X PUT \
	  -H "Authorization: Bearer $$GITHUB_TOKEN" \
	  -H "Accept: application/vnd.github+json" \
	  -H "X-GitHub-Api-Version: 2022-11-28" \
	  --data-binary @- \
	  https://api.github.com/repos/$(OWNER)/$(REPO)/branches/$(BRANCH)/protection >/dev/null
	@echo "Protected $(OWNER)/$(REPO)@$(BRANCH)"

# Remove branch protection
unprotect:
	@if [ -z "$$GITHUB_TOKEN" ]; then \
	  echo "Error: GITHUB_TOKEN not set" 1>&2; exit 1; \
	fi
	curl -sSf -X DELETE \
	  -H "Authorization: Bearer $$GITHUB_TOKEN" \
	  -H "Accept: application/vnd.github+json" \
	  -H "X-GitHub-Api-Version: 2022-11-28" \
	  https://api.github.com/repos/$(OWNER)/$(REPO)/branches/$(BRANCH)/protection >/dev/null
	@echo "Unprotected $(OWNER)/$(REPO)@$(BRANCH)"