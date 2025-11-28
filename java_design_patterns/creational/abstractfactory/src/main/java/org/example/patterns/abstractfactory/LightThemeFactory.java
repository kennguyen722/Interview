package org.example.patterns.abstractfactory;

public class LightThemeFactory implements ThemeFactory {
    @Override public Button createButton() { return () -> "LightButton"; }
    @Override public Menu createMenu() { return () -> "LightMenu"; }
}
