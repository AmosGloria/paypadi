export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      lease_reminders: {
        Row: {
          created_at: string
          id: string
          last_reminder_at: string | null
          lease_end: string
          property_id: string | null
          renewal_status: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_reminder_at?: string | null
          lease_end: string
          property_id?: string | null
          renewal_status?: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_reminder_at?: string | null
          lease_end?: string
          property_id?: string | null
          renewal_status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lease_reminders_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lease_reminders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          assigned_name: string | null
          assigned_to: string | null
          cost: number | null
          created_at: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["priority_level"]
          property_id: string | null
          status: Database["public"]["Enums"]["request_status"]
          tenant_id: string | null
          tenant_name: string | null
          type: Database["public"]["Enums"]["complaint_type"]
          unit_label: string | null
          updated_at: string
        }
        Insert: {
          assigned_name?: string | null
          assigned_to?: string | null
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          property_id?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          tenant_id?: string | null
          tenant_name?: string | null
          type?: Database["public"]["Enums"]["complaint_type"]
          unit_label?: string | null
          updated_at?: string
        }
        Update: {
          assigned_name?: string | null
          assigned_to?: string | null
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          property_id?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          tenant_id?: string | null
          tenant_name?: string | null
          type?: Database["public"]["Enums"]["complaint_type"]
          unit_label?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          kind: string
          message: string | null
          read: boolean
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          message?: string | null
          read?: boolean
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          message?: string | null
          read?: boolean
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_due: number
          amount_paid: number
          balance: number | null
          created_at: string
          created_by: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          notes: string | null
          payment_date: string
          proof_url: string | null
          property_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          tenant_id: string | null
        }
        Insert: {
          amount_due?: number
          amount_paid?: number
          balance?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          payment_date?: string
          proof_url?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          tenant_id?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          balance?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          notes?: string | null
          payment_date?: string
          proof_url?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          agent_id: string | null
          agent_name: string | null
          created_at: string
          created_by: string | null
          id: string
          landlord_id: string | null
          landlord_name: string | null
          name: string
          service_charge: number
          status: Database["public"]["Enums"]["property_status"]
          type: Database["public"]["Enums"]["property_type"]
          units: number
          updated_at: string
        }
        Insert: {
          address: string
          agent_id?: string | null
          agent_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          landlord_id?: string | null
          landlord_name?: string | null
          name: string
          service_charge?: number
          status?: Database["public"]["Enums"]["property_status"]
          type?: Database["public"]["Enums"]["property_type"]
          units?: number
          updated_at?: string
        }
        Update: {
          address?: string
          agent_id?: string | null
          agent_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          landlord_id?: string | null
          landlord_name?: string | null
          name?: string
          service_charge?: number
          status?: Database["public"]["Enums"]["property_status"]
          type?: Database["public"]["Enums"]["property_type"]
          units?: number
          updated_at?: string
        }
        Relationships: []
      }
      receipts: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          paid_on: string
          payment_id: string | null
          property_id: string | null
          property_name: string | null
          receipt_number: string
          tenant_id: string | null
          tenant_name: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          paid_on?: string
          payment_id?: string | null
          property_id?: string | null
          property_name?: string | null
          receipt_number: string
          tenant_id?: string | null
          tenant_name?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          paid_on?: string
          payment_id?: string | null
          property_id?: string | null
          property_name?: string | null
          receipt_number?: string
          tenant_id?: string | null
          tenant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          caution_fee: number
          created_at: string
          created_by: string | null
          email: string | null
          emergency_contact: string | null
          full_name: string
          id: string
          lease_end: string | null
          lease_start: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string | null
          property_id: string | null
          rent_amount: number
          rent_cycle: Database["public"]["Enums"]["rent_cycle"]
          unit_label: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          caution_fee?: number
          created_at?: string
          created_by?: string | null
          email?: string | null
          emergency_contact?: string | null
          full_name: string
          id?: string
          lease_end?: string | null
          lease_start?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string | null
          property_id?: string | null
          rent_amount?: number
          rent_cycle?: Database["public"]["Enums"]["rent_cycle"]
          unit_label?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          caution_fee?: number
          created_at?: string
          created_by?: string | null
          email?: string | null
          emergency_contact?: string | null
          full_name?: string
          id?: string
          lease_end?: string | null
          lease_start?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string | null
          property_id?: string | null
          rent_amount?: number
          rent_cycle?: Database["public"]["Enums"]["rent_cycle"]
          unit_label?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_manager: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "property_manager" | "landlord" | "agent" | "tenant"
      complaint_type:
        | "plumbing"
        | "electrical"
        | "security"
        | "cleaning"
        | "structural"
        | "other"
      payment_method: "bank_transfer" | "cash" | "pos" | "card"
      payment_status: "paid" | "partial" | "pending" | "overdue"
      priority_level: "low" | "medium" | "high"
      property_status: "occupied" | "vacant" | "under_maintenance"
      property_type:
        | "apartment"
        | "duplex"
        | "self_contained"
        | "shop"
        | "office"
        | "warehouse"
      rent_cycle: "monthly" | "quarterly" | "yearly"
      request_status: "open" | "in_progress" | "resolved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "property_manager", "landlord", "agent", "tenant"],
      complaint_type: [
        "plumbing",
        "electrical",
        "security",
        "cleaning",
        "structural",
        "other",
      ],
      payment_method: ["bank_transfer", "cash", "pos", "card"],
      payment_status: ["paid", "partial", "pending", "overdue"],
      priority_level: ["low", "medium", "high"],
      property_status: ["occupied", "vacant", "under_maintenance"],
      property_type: [
        "apartment",
        "duplex",
        "self_contained",
        "shop",
        "office",
        "warehouse",
      ],
      rent_cycle: ["monthly", "quarterly", "yearly"],
      request_status: ["open", "in_progress", "resolved"],
    },
  },
} as const
