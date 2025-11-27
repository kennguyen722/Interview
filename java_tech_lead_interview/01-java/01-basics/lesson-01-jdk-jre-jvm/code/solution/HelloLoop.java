public class HelloLoop {
	public static void main(String[] args) {
		// Simple loop demonstrating bytecode patterns (IINC, IF_ICMPGE)
		for (int i = 0; i < 3; i++) {
			System.out.println("Iteration " + i);
		}
	}
}
