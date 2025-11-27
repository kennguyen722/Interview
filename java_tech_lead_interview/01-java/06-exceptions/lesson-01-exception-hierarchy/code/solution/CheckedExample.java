class DataMissingException extends Exception { DataMissingException(String m){ super(m);} }
public class CheckedExample { static void read() throws DataMissingException { throw new DataMissingException("Missing"); } }
