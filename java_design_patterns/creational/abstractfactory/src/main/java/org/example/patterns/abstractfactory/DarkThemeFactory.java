package org.example.patterns.abstractfactory;

public class DarkThemeFactory implements ThemeFactory {
    @Override public Button createButton() { return () -> "DarkButton"; }
    @Override public Menu createMenu() { return () -> "DarkMenu"; }
}
