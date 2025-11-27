// @copilot:generate-tests
import org.junit.jupiter.api.Test;import static org.junit.jupiter.api.Assertions.*;import java.util.*;public class StreamsDemoTest { @Test void sum(){ assertEquals(6, Arrays.asList(2,4).stream().mapToInt(i->i).sum()); }}
