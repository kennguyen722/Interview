package idm.auth.token;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Base64;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TokenControllerTest {

  @LocalServerPort
  int port;

  @Autowired
  TestRestTemplate rest;

  private String url(String path){
    return "http://localhost:"+port+path;
  }

  @Test
  void shouldIssueTokenWithDemoCredentials() {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
    body.add("grant_type", "password");
    body.add("username", "demo");
    body.add("password", "demo");

    ResponseEntity<Map> resp = rest.postForEntity(url("/oauth/token"), new HttpEntity<>(body, headers), Map.class);
    assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
    Map<?,?> payload = resp.getBody();
    assertThat(payload).isNotNull();
    assertThat(payload).containsKeys("access_token", "refresh_token", "token_type", "expires_in", "scope");
    assertThat(payload.get("token_type")).isEqualTo("Bearer");
    assertThat((Integer)payload.get("expires_in")).isEqualTo(300);

    // Basic JWT shape check
    String jwt = (String) payload.get("access_token");
    String[] parts = jwt.split("\\.");
    assertThat(parts).hasSize(3);
    String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]));
    assertThat(headerJson).contains("\"RS256\"");
  }

  @Test
  void shouldPublishJwks() {
    ResponseEntity<Map> resp = rest.getForEntity(url("/oauth/jwks"), Map.class);
    assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
    Map<?,?> jwks = resp.getBody();
    assertThat(jwks).isNotNull();
    var keys = (java.util.List<Map<String,Object>>) jwks.get("keys");
    assertThat(keys).isNotEmpty();
    assertThat(keys.get(0).get("kty")).isEqualTo("RSA");
  }

  @Test
  void shouldRefreshToken() {
    // get initial token
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
    body.add("grant_type", "password");
    body.add("username", "demo");
    body.add("password", "demo");
    Map tokenResp = rest.postForObject(url("/oauth/token"), new HttpEntity<>(body, headers), Map.class);
    String refresh = (String) tokenResp.get("refresh_token");

    // exchange refresh
    MultiValueMap<String, String> body2 = new LinkedMultiValueMap<>();
    body2.add("refresh_token", refresh);
    ResponseEntity<Map> resp = rest.postForEntity(url("/oauth/refresh"), new HttpEntity<>(body2, headers), Map.class);
    assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(resp.getBody()).containsKeys("access_token", "refresh_token");
  }
}
